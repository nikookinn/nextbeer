import { baseApi } from './baseApi';
import { ItemTagRequestDto, ItemTagResponse } from '../types/itemTag';

export const itemTagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllItemTags: builder.query<ItemTagResponse[], void>({
      query: () => '/itemTags',
      providesTags: ['ItemTag'],
    }),
    getItemTagById: builder.query<ItemTagResponse, number>({
      query: (id) => `/itemTags/${id}`,
      providesTags: (_, __, id) => [{ type: 'ItemTag', id }],
    }),
    getItemTagsByItemId: builder.query<ItemTagResponse[], number>({
      query: (itemId) => `/itemTags/item/${itemId}`,
      providesTags: (_, __, itemId) => [{ type: 'ItemTag', id: `item-${itemId}` }],
    }),
    createItemTag: builder.mutation<ItemTagResponse, ItemTagRequestDto>({
      query: (itemTag) => ({
        url: '/itemTags',
        method: 'POST',
        body: itemTag,
      }),
      invalidatesTags: ['ItemTag'],
    }),
    updateItemTag: builder.mutation<ItemTagResponse, { id: number; itemTag: ItemTagRequestDto }>({
      query: ({ id, itemTag }) => ({
        url: `/itemTags/${id}`,
        method: 'PUT',
        body: itemTag,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'ItemTag', id }, 'ItemTag'],
    }),
    deleteItemTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/itemTags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'ItemTag', id }, 'ItemTag'],
    }),
  }),
});

export const {
  useGetAllItemTagsQuery,
  useGetItemTagByIdQuery,
  useGetItemTagsByItemIdQuery,
  useCreateItemTagMutation,
  useUpdateItemTagMutation,
  useDeleteItemTagMutation,
} = itemTagApi;
