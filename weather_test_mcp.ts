// This file is just for learning purposes and does not contain any real functionality.
// It is a simple Model Context Protocol (MCP) server that provides a tool to fetch weather information.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: 'Demo',
    version: '0.0.1',
});

server.tool(
    'fetch-weather',
    'Tool to fetch the weather of a city',
    {
        city: z.string().describe('City name'),
    },
    async ({ city }) => {
        return {
            content: [
                {
                    type: 'text',
                    text: `The weather in ${city} is sunny.`,
                }
            ]
        };
    },
)

const transport = new StdioServerTransport()
await server.connect(transport)