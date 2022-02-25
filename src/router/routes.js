import UserLayout from "layouts/UserLayout";
import MessageHistory from "components/MessageHistory";

const routes = [
  // {
  //   path: "/",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     { path: "", component: () => import("pages/Index.vue") },
  //     {
  //       path: "/user/:channelID",
  //       component: () => import("components/MessageHistory.vue"),
  //     },
  //   ],
  // },
  {
    name: "channel view",
    path: "/user",
    component: UserLayout,
    children: [{
      path: ":channelID",
      component: MessageHistory,
    }
    ]
  },
  // {
  //   name: "channel view",
  //   path: "/user/:channelID",
  //   component: () => import("layouts/UserLayout.vue"),
  //   // children: [
  //   //   {
  //   //     path: "/user/:channelID",
  //   //     component: () => import("components/MessageHistory.vue"),
  //   //   },
  //   //   {
  //   //     path: "/context/:messageID",
  //   //     component: () => import("components/MessageContext"),
  //   //   },
  //   // ],
  // },
  {
    name: "api key entry",
    path: "/apikey",
    component: () => import("layouts/ApiKey.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    name: "error",
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
