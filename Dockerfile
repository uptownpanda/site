FROM node:fermium-alpine AS build

ARG nextjs_environment
ARG token_contract_address
ARG presale_contract_address
ARG liquidity_lock_contract_address
ARG up_farm_contract_address
ARG up_eth_farm_contract_address
ARG weth_farm_contract_address
ARG wbtc_farm_contract_address

ENV NEXTJS_ENVIRONMENT=${nextjs_environment}
ENV TOKEN_CONTRACT_ADDRESS=${token_contract_address}
ENV PRESALE_CONTRACT_ADDRESS=${presale_contract_address}
ENV LIQUIDITY_LOCK_CONTRACT_ADDRESS=${liquidity_lock_contract_address}
ENV UP_FARM_CONTRACT_ADDRESS=${up_farm_contract_address}
ENV UP_ETH_FARM_CONTRACT_ADDRESS=${up_eth_farm_contract_address}
ENV WETH_FARM_CONTRACT_ADDRESS=${weth_farm_contract_address}
ENV WBTC_FARM_CONTRACT_ADDRESS=${wbtc_farm_contract_address}

WORKDIR /app
COPY ./src ./
RUN npm install
RUN npm run build

FROM node:fermium-alpine AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start"]