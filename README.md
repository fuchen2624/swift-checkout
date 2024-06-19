# Relay Club Computer Store Checkout System

This project is an implementation of a checkout system for Relay Club's computer store. It allows customers to add products to their cart and calculates the total price based on the applicable pricing rules.

## Features

- Dynamic pricing rules that can be updated by sales managers
- Flexible and extensible architecture
- Integration with Supabase for storing pricing rules and product information
- Test-driven development (TDD) approach

## Tech Stack

- NextJS
- ReactJS
- TypeScript
- Supabase
- Chakra UI
- Jest (for testing)

## Getting Started

### Prerequisites

- Node.js (version 14 or above)
- npm (version 6 or above)
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fuchen2624/swift-checkout.git
   ```

2. Navigate to the project directory:

   ```bash
   cd swift-checkout
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Retrieve the project URL and anon key from the project settings
   - Create a `.env.local` file in the root of the project
   - Add the following environment variables to the `.env.local` file:
     ```
     SUPABASE_URL=<your-supabase-project-url>
     SUPABASE_SERVICE_KEY=<your-supabase-anon-key>
     ```

5. Create the necessary tables in Supabase:
   - Open the Supabase SQL Editor
   - Create the `products` and `pricing_rules` tables (refer to the SQL schema in `database/schema.sql`)

6. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Usage

1. Open the application in your web browser.
2. Browse the available products and add them to your cart.
3. View the cart items and the calculated total price.
4. Proceed to checkout to complete the purchase.

## Pricing Rules

The pricing rules are stored in the `pricing_rules` table in Supabase. Sales managers can update the pricing rules through the admin interface. `http://localhost:3000/admin/pricing-rules`

The available pricing rule types are:

- Quantity Discount: Applies a discount based on the quantity of a specific product in the cart.
- Bundle: Includes a free item when a specific product is purchased.

## Testing

The project follows a test-driven development (TDD) approach. Unit tests are written for the pricing rule functions and integration tests are written for the checkout functionality.

To run the tests:

```bash
npm test
```

