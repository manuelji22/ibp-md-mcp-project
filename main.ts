import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: 'Get IBP Master Data',
    version: '0.0.1',
});

server.tool(
    "get-single-ibp-master-data",
    "Tool to fetch master data from IBP for a single master data type",
    { masterData: z.string().describe("Master data name") },
    async ({ masterData }) => {
        // Map masterData types to their corresponding attributes
        const attributeMap: Record<string, string> = {
            "PFAM": "ZMDMPLATFORMNAME",
            "Resource": "ZMDMRESOURCENAME",
            "Supplier": "ZMDMSUPPLIERNAME",
            // Default to "ZMANUFACTURENAME" for any other masterData type
            "default": "ZMDMPLATFORMNAME"
        };

        // Get the attribute from the map or use the default
        const attribute = attributeMap[masterData] || attributeMap.default;

        const username = "GPT";
        const password = process.env.IBP_PASSWORD;
        if (!username || !password) {
            throw new Error('IBP credentials not found in environment variables');
        }

        const api = `${process.env.IBP_URL}select=${attribute}&$format=json`;
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        const response = await fetch(api.toString(), {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        if (!response.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching data from IBP: ${response.statusText}`
                    }
                ]
            }
        }
        const data = await response.json() as { d: { results: Record<string, string>[] } }
        if (!data.d?.results?.length) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No data found for ${masterData}`
                    }
                ]
            }
        }
        const results = data.d.results.map(item => item[attribute]).slice(0, 30);
        return {
            content: [{
                type: "text",
                text: JSON.stringify(results, null, 2)
            }]
        }
    }
);

server.tool(
    "get-ibp-master-data-multiple",
    "Tool to fetch master data from IBP for multiple master data types",
    { masterData: z.array(z.string()).describe("Master data names") },
    async ({ masterData }) => {
        const attributeMap: Record<string, string> = {
            "PFAM": "ZMDMPLATFORMNAME",
            "Resource": "ZMDMRESOURCENAME",
            "Supplier": "ZMDMSUPPLIERNAME",
            "default": "ZMDMPLATFORMNAME"
        };

        const username = "GPT";
        const password = process.env.IBP_PASSWORD;
        if (!username || !password) {
            throw new Error('IBP credentials not found in environment variables');
        }

        // Build list of attributes to select
        const attributes = masterData.map(type => attributeMap[type] || attributeMap.default);
        const selectParam = attributes.join(",");

        const api = `${process.env.IBP_URL}select=${selectParam}&$format=json`;
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        const response = await fetch(api, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        if (!response.ok) {
            return { content: [{ type: "text", text: `Error fetching data from IBP: ${response.statusText}` }] };
        }

        const data = await response.json() as { d: { results: Record<string, string>[] } };
        if (!data.d?.results?.length) {
            return { content: [{ type: "text", text: "No data found for requested master data types" }] };
        }

        const results: Record<string, string[]> = {};
        masterData.forEach((type, idx) => {
            const attr = attributes[idx];
            results[type] = data.d.results.map(item => item[attr]).slice(0, 30);
        });

        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    }
);

// New tool to list available master data attributes
server.tool(
    "list-ibp-master-data-attributes",
    "Tool to list possible master data types and their IBP attribute names to properly call the other tools",
    {},
    async () => {
        const attributeMap: Record<string, string> = {
            "PFAM": "ZMDMPLATFORMNAME",
            "Resource": "ZMDMRESOURCENAME",
            "Supplier": "ZMDMSUPPLIERNAME",
        };
        const list = Object.entries(attributeMap).map(([type, attribute]) => ({ type, attribute }));
        return { content: [{ type: "text", text: JSON.stringify(list, null, 2) }] };
    }
);

const transport = new StdioServerTransport()
await server.connect(transport)


