// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
// Define a service using a base URL and expected endpoints
export const API = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_VERSION}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: ({ uid }) => ({
        url: `/users/${uid}/logout`,
        method: "POST",
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    verifySignup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "PUT",
        body: credentials,
      }),
    }),
    getMetrics: builder.query({
      query: ({ uid }) => ({
        url: `/users/${uid}/dashboard`,
        method: "GET",
      }),
    }),
    recoverPassword: builder.mutation({
      query: (data) => ({
        url: "/recovery",
        method: "POST",
        body: data,
      }),
    }),
    verifyRecoveryCode: builder.mutation({
      query: (data) => ({
        url: "/recovery",
        method: "PUT",
        body: data,
      }),
    }),
    newPassword: builder.mutation({
      query: ({ uid, new_password }) => ({
        url: `/users/${uid}/recovery`,
        method: "POST",
        body: {
          new_password: new_password,
        },
      }),
    }),
    changePassword: builder.mutation({
      query: ({ uid, password, new_password }) => ({
        url: `/users/${uid}/password`,
        method: "POST",
        body: {
          password: password,
          new_password: new_password,
        },
      }),
    }),
    deleteAccount: builder.mutation({
      query: ({ uid, password }) => ({
        url: `/users/${uid}`,
        method: "DELETE",
        body: {
          password,
        },
      }),
    }),
    storeToken: builder.mutation({
      query: ({ uid, url, phone_number }) => ({
        url: `/users/${uid}${url}`,
        method: "POST",
        body: phone_number ? { phone_number } : {}, // if theres a phone number then send it
      }),
    }),
    verifyTokenStorage: builder.mutation({
      query: ({
        uid,
        code,
        platform,
        protocol,
        oauth_token,
        oauth_verifier,
        phone_number,
      }) => ({
        url: `/users/${uid}/platforms/${platform}/protocols/${protocol}`,
        method: "PUT",
        body: {
          code,
          oauth_token,
          oauth_verifier,
          phone_number,
        },
      }),
    }),
    createExternalAccount: builder.mutation({
      query: ({
        uid,
        platform,
        protocol,
        first_name,
        last_name,
        phone_number,
      }) => ({
        url: `/users/${uid}/platforms/${platform}/protocols/${protocol}/register`,
        method: "PUT",
        body: {
          first_name,
          last_name,
          phone_number,
        },
      }),
    }),
    tokenRevoke: builder.mutation({
      query: ({ uid, url, password }) => ({
        url: `/users/${uid}${url}`,
        method: "DELETE",
        body: {
          password: password,
        },
      }),
    }),
    getPlatforms: builder.query({
      query: ({ uid }) => ({
        url: `/users/${uid}/platforms`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          savedPlatforms: response.saved_platforms,
          unSavedPlatforms: response.unsaved_platforms,
        };
      },
    }),
    getDocs: builder.query({
      query: () => ({
        url: process.env.REACT_APP_DOCS_URL,
        method: "GET",
        credentials: "omit",
        headers: {
          "content-type": "text/plain",
        },
        responseHandler: (response) => response.text(), // expect response type to be text/plain
      }),
    }),
    sync: builder.query({
      query: ({ uid }) => ({
        url: `${process.env.REACT_APP_GATEWAY_SERVER}/${process.env.REACT_APP_GATEWAY_SERVER_VERSION}/sync/users/${uid}`,
        method: "GET",
        headers: {
          "content-type": "text/plain",
        },
        responseHandler: (response) => response.text(), // expect response type to be text/plain
      }),
      transformResponse: (response) => {
        return {
          syncURL: response,
          qrLink: "",
          status: "disconnected",
        };
      },
      async onCacheEntryAdded(
        arg,
        { cacheEntryRemoved, cacheDataLoaded, updateCachedData }
      ) {
        try {
          // wait for the initial query to resolve before proceeding
          const { data } = await cacheDataLoaded;
          // create a websocket connection when the cache subscription starts

          const ws = new WebSocket(data.syncURL);

          ws.onopen = () => {
            toast.success("Sync started");
            updateCachedData((draft) => {
              return {
                ...draft,
                status: "connected",
              };
            });
          };
          // listen to data sent from the websocket server
          ws.onmessage = (evt) => {
            if (evt.data === "200- acked") {
              toast.success("Sync Complete");
              updateCachedData((draft) => {
                return {
                  ...draft,
                  status: "complete",
                };
              });
            } else if (evt.data === "201- paused") {
              updateCachedData((draft) => {
                return {
                  ...draft,
                  status: "scanned",
                };
              });
            } else {
              updateCachedData((draft) => {
                return {
                  ...draft,
                  qrLink: evt.data,
                };
              });
            }
          };

          ws.onclose = () => {
            toast.success(
              "Sync session closed. please click the sync button to start again"
            );
            updateCachedData((draft) => {
              return {
                ...draft,
                status: "disconnected",
              };
            });
          };

          ws.onerror = (err) => {
            toast.error("An error occured Please try again");
          };
        } catch (err) {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
          toast.error("An error occured, please try again");
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved;
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSyncQuery,
  useGetDocsQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useGetMetricsQuery,
  useGetPlatformsQuery,
  useStoreTokenMutation,
  useNewPasswordMutation,
  useTokenRevokeMutation,
  useVerifySignupMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
  useRecoverPasswordMutation,
  useVerifyRecoveryCodeMutation,
  useVerifyTokenStorageMutation,
  useCreateExternalAccountMutation,
} = API;
