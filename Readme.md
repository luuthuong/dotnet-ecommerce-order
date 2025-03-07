# E-Commerce Order Event Sourcing 

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Business Workflow](#business-workflow)
5. [Setting Up and Running the Project](#setting-up-and-running-the-project)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

## Introduction

This project implements an E-Commerce Order Management system using Event Sourcing and CQRS (Command Query Responsibility Segregation) patterns. Instead of storing just the current state of orders, the system stores a complete history of events that led to the current state, providing a complete audit trail and enabling advanced business analytics.

### Key Features

- Complete order lifecycle management from creation to delivery
- Immutable event history for every order
- Separate read and write models for optimized performance
- RESTful API with versioning
- Containerized deployment with Docker
- Comprehensive error handling and logging

## Technology Stack

### Backend Technologies

- **C# and .NET 9**: Core programming language and framework
- **ASP.NET Core Web API**: Framework for building RESTful APIs
- **Entity Framework Core**: ORM for data access
- **MediatR**: Implementation of the mediator pattern for in-process messaging
- **SQL Server**: Database for event storage and read models

### Infrastructure

- **Docker**: Containerization for consistent deployment
- **Swagger/OpenAPI**: API documentation and testing

### Design Patterns

- **Event Sourcing**: Storing state changes as a sequence of events
- **CQRS**: Separating read and write operations
- **Clean Architecture**: Organizing code in layers with clear dependencies
- **Domain-Driven Design**: Modeling complex domains with a common language

## Architecture Overview

### Event-Driven Design (EDD)

Event-Driven Design is an architectural paradigm that defines a system's behavior through events - significant state changes that occur within the system. In our e-commerce application, events drive the flow of information and state changes throughout the system.

#### Key Concepts in Event-Driven Design

##### Events

An event represents something that has already happened within the domain. Events are named in past tense (e.g., `OrderCreated`, `PaymentProcessed`) and are immutable facts.

Example event types in our system:
- `OrderCreatedEvent`
- `OrderItemAddedEvent`
- `OrderAddressSetEvent`
- `OrderPaidEvent`
- `OrderShippedEvent`
- `OrderCanceledEvent`

##### Event Handlers

Event handlers react to specific events and perform operations in response. These might include:
- Updating read models
- Triggering external processes
- Generating notifications
- Triggering subsequent commands

#### Benefits of Event-Driven Design

1. **Loose Coupling**: Components are decoupled, communicating only through events
2. **Extensibility**: New functionality can be added by subscribing to existing events
3. **Scalability**: Event processing can be distributed and parallelized
4. **Audit Trail**: Events provide a built-in audit mechanism
5. **Replay Capability**: Events can be replayed to reconstruct state or test new features

### Event Sourcing

Event Sourcing is a persistence pattern where we store the state of an entity as a sequence of state-changing events rather than just the current state.

#### How Event Sourcing Works in Our Application

1. **Command Processing**: User actions trigger commands (e.g., `CreateOrderCommand`)
2. **Event Generation**: Commands generate domain events when validated and executed
3. **Event Storage**: Events are stored in an append-only event store
4. **State Reconstruction**: The current state of an entity is built by replaying its events
5. **Read Model Updates**: Events are used to update read models for efficient querying

#### Event Store Design

Our event store uses a single table with the following structure:

| Column      | Type             | Description                         |
|-------------|------------------|-------------------------------------|
| Id          | uniqueidentifier | Primary key for the event           |
| AggregateId | uniqueidentifier | ID of the aggregate (e.g., OrderId) |
| Timestamp   | datetime2        | When the event occurred             |
| Version     | int              | Sequence number for the aggregate   |
| EventType   | nvarchar(255)    | The .NET type name of the event     |
| EventData   | nvarchar(max)    | Serialized JSON event data          |

#### Aggregate Reconstruction Process

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│ Load      │     │ Sort by   │     │ Apply     │     │ Return    │
│ Events    │ ──► │ Version   │ ──► │ Events    │ ──► │ Aggregate │
│ From DB   │     │           │     │ In Order  │     │           │
└───────────┘     └───────────┘     └───────────┘     └───────────┘
```

### CQRS (Command Query Responsibility Segregation)

CQRS separates read and write operations into different models:

#### Command Side (Write Model)

- Processes commands that modify state
- Uses richly-modeled domain entities
- Validates business rules
- Emits events on state changes
- Optimized for consistency and correctness

#### Query Side (Read Model)

- Processes queries that retrieve data
- Uses denormalized views optimized for queries
- Updated asynchronously based on events
- Can be scaled independently of the write model
- Optimized for performance and scalability

#### CQRS Flow in Our Application

```
┌─────────┐     ┌────────────┐     ┌─────────────┐     ┌────────────┐     ┌────────────┐
│ Command │     │ Command    │     │ Domain      │     │ Event      │     │ Read Model │
│ API     │ ──► │ Handler    │ ──► │ Events      │ ──► │ Store      │ ──► │ Projector  │
│         │     │            │     │             │     │            │     │            │
└─────────┘     └────────────┘     └─────────────┘     └────────────┘     └────────────┘
                                                                                 │
┌─────────┐     ┌────────────┐                                                   │
│ Query   │     │ Query      │                                                   │
│ API     │ ◄── │ Handler    │ ◄──────────────────────────────────────────────────
│         │     │            │
└─────────┘     └────────────┘
```

### Clean Architecture

Our application follows Clean Architecture principles, organizing code in concentric layers with dependencies pointing inward.

#### Layers

1. **Domain Layer** (Core)
   - Contains entities, value objects, aggregates, and domain events
   - Pure business logic without dependencies on infrastructure
   - Defines interfaces for repositories and services

2. **Application Layer**
   - Contains command and query handlers
   - Orchestrates domain objects to perform use cases
   - Defines interfaces that are implemented by outer layers

3. **Infrastructure Layer**
   - Contains implementations of repository interfaces
   - Manages data access, event storage, and serialization
   - Interfaces with external systems and services

4. **Presentation Layer**
   - Contains API controllers and request/response models
   - Converts between API models and application commands/queries
   - Manages HTTP concerns like routing and status codes

#### Benefits of Clean Architecture

- **Testability**: Core business logic can be tested without infrastructure dependencies
- **Flexibility**: Infrastructure components can be changed without affecting business logic
- **Maintainability**: Clear separation of concerns makes the codebase easier to understand
- **Independence**: Business rules don't depend on UI, database, or external frameworks

### Project Structure

Our solution is organized according to Clean Architecture principles:

```
EcommerceOrder/
├── Domain/                         # Domain Layer
│   ├── Aggregates/                 # Aggregate roots
│   ├── Entities/                   # Domain entities
│   ├── Events/                     # Domain events
│   └── ValueObjects/               # Value objects
│
├── Application/                    # Application Layer
│   ├── Commands/                   # Command objects
│   ├── Queries/                    # Query objects
│   ├── DTOs/                       # Data transfer objects
│   └── Interfaces/                 # Interfaces for infrastructure
│
├── Infrastructure/                 # Infrastructure Layer
│   ├── EventStore/                 # Event storage implementation
│   ├── QueryStore/                 # Read model storage
│   ├── Repositories/               # Repository implementations
│   ├── EventProcessing/            # Event processors
│   └── ServiceCollectionExtensions # Service registration
│
├── Api/                            # Presentation Layer
│   ├── Controllers/                # API controllers
│   ├── Models/                     # Request/response models
│   ├── Program.cs                  # Application entry point
│   └── appsettings.json            # Configuration
│
└── docker-compose.yml              # Docker configuration
```

### Domain-Driven Design (DDD)

Our application uses Domain-Driven Design principles to model complex business domains effectively.

#### DDD Building Blocks

1. **Ubiquitous Language**: Common vocabulary used by developers and domain experts
   - Order, Item, Payment, Shipping, etc.

2. **Bounded Contexts**: Clear boundaries between different parts of the domain
   - Order Management
   - Inventory Management
   - Payment Processing

3. **Entities**: Objects with identity and lifecycle
   - Order, OrderItem

4. **Value Objects**: Immutable objects without identity
   - Money, Address

5. **Aggregates**: Cluster of domain objects treated as a single unit
   - OrderAggregate (containing OrderItems)

6. **Repositories**: Provide collection-like interface for accessing aggregates
   - OrderRepository

7. **Domain Events**: Record of something significant that happened in the domain
   - OrderCreatedEvent, OrderPaidEvent

#### DDD Benefits in Our Project

- **Alignment with Business**: The model closely reflects business concepts
- **Clarity**: Clearly defined boundaries and responsibilities
- **Focus on Core Complexity**: Emphasis on the complex parts of the domain
- **Strategic Design**: Ability to evolve different parts of the system separately

#### Database Design

The system uses two logical database contexts:

1. **Event Store**: Stores all events in a single table with these key columns:
   - Id: Unique event identifier
   - AggregateId: Order ID this event belongs to
   - Version: Sequential version number for this aggregate
   - EventType: Type of the event
   - Payload: Serialized JSON event data
   - Timestamp: When the event occurred

2. **Read Models**: Stores denormalized views for querying:
   - OrderViews: Current state of orders
   - OrderItemViews: Items belonging to orders

## Business Workflow

### Order Lifecycle

Orders in the system go through the following states:

1. **New**: Initial state when an order is created
2. **Pending**: State after adding at least one item
3. **Paid**: State after payment is processed
4. **Shipped**: State after shipping information is added
5. **Delivered**: (Optional) State after delivery is confirmed
6. **Canceled**: State if the order is canceled

### Event Flow

A typical order flow generates this sequence of events:

1. `OrderCreatedEvent`: When a customer creates a new order
2. `OrderItemAddedEvent`: When products are added to the order
3. `OrderAddressSetEvent`: When shipping address is specified
4. `OrderPaidEvent`: When payment is processed
5. `OrderShippedEvent`: When the order is shipped
6. `OrderDeliveredEvent` or `OrderCanceledEvent`: Final state events

### Key Business Rules

- Orders must have at least one item before they can be paid
- Payment amount must match the order total
- Orders cannot be modified after payment
- Orders cannot be shipped until they are paid
- Orders cannot be canceled after shipping

## Setting Up and Running the Project

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) (for development)

### Clone the Repository

```bash
git clone https://github.com/luuthuong/dotnet-ecommerce-order
cd dotnet-ecommerce-order
```

### Configuration

Edit `appsettings.json` to configure the application:

```json
{
  "ConnectionStrings": {
    "EventStore": "Server=sql-server;Database=ECommerceEventStore;User Id=sa;Password=YourStr0ngP@ssw0rd;TrustServerCertificate=True;",
    "QueryStore": "Server=sql-server;Database=ECommerceQueryStore;User Id=sa;Password=YourStr0ngP@ssw0rd;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "ECommerce": "Debug"
    }
  }
}
```

### Docker Setup

1. **Build and start the containers**:

   ```bash
   docker-compose up -d
   ```

   This command will:
   - Start SQL Server container
   - Build and start the API container
   - Initialize the databases

2. **Verify the setup**:

   Access the Swagger UI at:
   ```
   http://localhost:5251/swagger
   ```

### Manual Database Setup (if needed)

If you need to manually run migrations:

```bash
# For the Event Store
dotnet ef database update --context EventStoreDbContext

# For the Query Store
dotnet ef database update --context QueryDbContext
```

## API Reference

### Order Management Endpoints

| Method | Endpoint                             | Description                                     |
|--------|--------------------------------------|-------------------------------------------------|
| POST   | /api/v1/orders                       | Create a new order with items and address       |
| GET    | /api/v1/orders/{id}                  | Get a specific order by ID                      |
| GET    | /api/v1/orders                       | Get all orders, optionally filtered by customer |
| GET    | /api/v1/orders/status/{status}       | Get orders by status                            |
| POST   | /api/v1/orders/{id}/items            | Add an item to an existing order                |
| POST   | /api/v1/orders/{id}/shipping-address | Set shipping address for an order               |
| POST   | /api/v1/orders/{id}/payments         | Process payment for an order                    |
| POST   | /api/v1/orders/{id}/ship             | Ship an order                                   |
| POST   | /api/v1/orders/{id}/cancel           | Cancel an order                                 |

### Sample Request: Create Order with Items

```json
{
    "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
    },
    "orderItems": [
        {
            "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "productName": "Smartphone",
            "unitPrice": {
                "amount": "799.99",
                "currency": "USD"
            },
            "quantity": 2
        }
    ]
}
```

### Sample Response

```json
{
    "success": true,
    "message": "Order created successfully",
    "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
