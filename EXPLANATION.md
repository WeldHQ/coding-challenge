
### Features

- For the communication between **data-streams** and **worker** services, I chose the TCP protocol. Reliable and connection-oriented protocol.
- The **data-streams** service has an endpoint to instruct the **worker** service to start fetching data from an external API at a defined interval (every 5 minutes). This is achieved using NestJS's microservices communication layer.
- The **worker** service utilizes the **@nestjs/axios** module to communicate with external APIs.
- data fetched by the **worker** service is sent back to the data-streams service, where it's stored in-memory for simplicity.
- An endpoint exists in the **data-streams** service to instruct the worker to stop fetching data.

### API endpoints

1. **Start Fetching Data**
- **Endpoint**: `/start-fetching`
- **Method**: `GET`
- **Description**: This endpoint triggers the worker service to start fetching data from an external API at a specified interval (default is every 5 minutes)
- **Response**: A confirmation message indicating that the data fetching process has started.

2. **Stop Fetching Data**
- **Endpoint**: `/stop-fetching`
- **Method**: `GET`
- **Description**: This endpoint instructs the worker service to stop fetching data from the external API.
- **Response**: A confirmation message indicating that the data fetching process has been stopped.

3. **Retrieve Stored Data**
- **Endpoint**: `/data`
- **Method**: `GET`
- **Description**: Fetches the data that has been stored in the data-streams service.
- **Response**: Returns the stored data.
