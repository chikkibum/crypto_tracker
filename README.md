# Crypto Tracker Application

A real-time cryptocurrency tracking application built with React, TypeScript and Material-UI.

## Approach and Tools Used

### Core Technologies
- **React + TypeScript**: For type-safe component development
- **Material UI**: For consistent and responsive UI components
- **Chart.js**: For interactive price history charts
- **Axios**: For API requests with custom caching layer
- **React Router**: For client-side routing
- **TSS**: For type-safe CSS-in-JS styling

### Architecture Highlights
- Custom hook `useApiCache` for optimized data fetching with caching
- Context API for global state management (currency selection)
- Responsive design with mobile-first approach
- Component-based architecture with clear separation of concerns

## Challenges and Solutions

### 1. API Rate Limiting
**Challenge**: CoinGecko's free API has strict rate limits that were causing request failures.

**Solution**: 
- Implemented caching layer with `useApiCache` hook
- Added error handling for rate limit responses
- Set cache duration to 30 seconds to reduce API calls
- Added CORS proxy to handle API restrictions

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/crypto-tracker.git
    cd crypto-tracker
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory.

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Build the application:
    ```bash
    npm run build
    ```

### Notes
- The application uses CoinGecko's free API, which has rate limits.
- A CORS proxy is required for API access.
- Cache duration is set to 30 seconds by default.

## Contributing

1. Fork the repository.
2. Create your feature branch:
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/AmazingFeature
    ```
5. Open a Pull Request.
