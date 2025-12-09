import simpleRestDataProvider from "@refinedev/simple-rest";
import { DataProvider } from "@refinedev/core";

export const customDataProvider = (apiUrl: string): DataProvider => {
    const baseDataProvider = simpleRestDataProvider(apiUrl);

    return {
        ...baseDataProvider,
        getList: async ({ resource, pagination, filters, sorters, meta }) => {
            const response = await baseDataProvider.getList({
                resource,
                pagination,
                filters,
                sorters,
                meta,
            });

            // Check if the data is wrapped in a "data" property (common in NestJS/pagination)
            const responseData: any = response.data;
            if (responseData && typeof responseData === 'object' && !Array.isArray(responseData) && Array.isArray(responseData.data)) {
                return {
                    data: responseData.data,
                    total: responseData.meta?.totalItems ?? responseData.meta?.total ?? responseData.data.length,
                };
            }

            return response;
        },
        // We might need to override other methods if they also follow this pattern
        // For now, getList is the primary cause of table crashes
    };
};
