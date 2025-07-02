# IBP Master Data MCP Server

A Model Context Protocol (MCP) server that provides tools to fetch master data from IBP (Integrated Business Planning) systems.

## Overview

This MCP server exposes three tools to interact with IBP master data:
- Fetch single master data type
- Fetch multiple master data types
- List available master data attributes

## Features

- **Single Master Data Retrieval**: Fetch master data for a specific type (PFAM, Resource, Supplier)
- **Bulk Master Data Retrieval**: Fetch multiple master data types in a single request
- **Attribute Mapping**: Lists available master data types and their corresponding IBP attributes
- **Error Handling**: Comprehensive error handling for authentication and API failures
- **Data Limiting**: Returns up to 30 results per master data type to prevent overwhelming responses

## Prerequisites

- Node.js (version 16 or higher)
- pnpm package manager
- Access to an IBP system with valid credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-newsletter
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create a .env file or set environment variables
IBP_URL=your_ibp_base_url_here
IBP_PASSWORD=your_ibp_password_here
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `IBP_URL` | Base URL for the IBP API endpoint | Yes |
| `IBP_PASSWORD` | Password for IBP authentication (username is hardcoded as "GPT") | Yes |

## Usage

### Running the Server

```bash
# Development
pnpm start

# Or using Node.js directly
node main.ts
```

### Available Tools

#### 1. get-single-ibp-master-data

Fetches master data for a single master data type.

**Parameters:**
- `masterData` (string): The master data type name

**Supported Master Data Types:**
- `PFAM` - Platform names (maps to `ZMDMPLATFORMNAME`)
- `Resource` - Resource names (maps to `ZMDMRESOURCENAME`) 
- `Supplier` - Supplier names (maps to `ZMDMSUPPLIERNAME`)

**Example Usage:**
```json
{
  "masterData": "PFAM"
}
```

#### 2. get-ibp-master-data-multiple

Fetches master data for multiple master data types in a single request.

**Parameters:**
- `masterData` (array of strings): Array of master data type names

**Example Usage:**
```json
{
  "masterData": ["PFAM", "Resource", "Supplier"]
}
```

#### 3. list-ibp-master-data-attributes

Lists all available master data types and their corresponding IBP attribute names.

**Parameters:** None

**Returns:** A list of master data types with their IBP attribute mappings.

## API Response Format

All tools return responses in the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON string containing the results"
    }
  ]
}
```

### Success Response Examples

**Single Master Data:**
```json
[
  "Platform1",
  "Platform2",
  "Platform3"
]
```

**Multiple Master Data:**
```json
{
  "PFAM": ["Platform1", "Platform2"],
  "Resource": ["Resource1", "Resource2"],
  "Supplier": ["Supplier1", "Supplier2"]
}
```

**Attribute List:**
```json
[
  {"type": "PFAM", "attribute": "ZMDMPLATFORMNAME"},
  {"type": "Resource", "attribute": "ZMDMRESOURCENAME"},
  {"type": "Supplier", "attribute": "ZMDMSUPPLIERNAME"}
]
```

## Error Handling

The server handles various error scenarios:

- **Missing Credentials**: Returns error if IBP_PASSWORD environment variable is not set
- **API Errors**: Returns HTTP error messages from the IBP API
- **No Data Found**: Returns appropriate message when no results are found
- **Invalid Master Data Types**: Falls back to default attribute mapping

## Authentication

The server uses HTTP Basic Authentication with:
- **Username**: `GPT` (hardcoded)
- **Password**: Retrieved from `IBP_PASSWORD` environment variable

## Technical Details

- **Framework**: Model Context Protocol (MCP) SDK
- **Transport**: Standard I/O (stdio)
- **Validation**: Zod schema validation for parameters
- **HTTP Client**: Native fetch API
- **Data Format**: JSON responses from IBP API

## Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^x.x.x",
  "zod": "^x.x.x"
}
```

## Changelog

### Version 0.0.1
- Initial release
- Basic master data fetching functionality
- Support for PFAM, Resource, and Supplier master data types
- Single and multiple master data retrieval tools
- Attribute listing tool
