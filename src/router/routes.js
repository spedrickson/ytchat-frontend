import UserLayout from "layouts/UserLayout";
import FilterLayout from "layouts/FilterLayout";
import MessageHistory from "components/MessageHistory";
import ModComments from "components/ModComments";
import SentimentLayout from "layouts/SentimentLayout";
import RandomLayout from "layouts/RandomLayout";
import IndexLayout from "layouts/IndexLayout";

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: IndexLayout,
  },
  {
    name: "channel view",
    path: "/user",
    component: UserLayout,
    children: [
      {
        path: ":channelID",
        component: MessageHistory,
        alias: ":channelID/messages",
      },
      {
        path: ":channelID/messages",
        component: MessageHistory,
      },
      {
        path: ":channelID/comments",
        component: () => import("pages/UserComments.vue"),
      },
      {
        path: ":channelID/modcomments",
        component: ModComments,
      },
    ],
  },
  {
    path: "/filtered",
    component: FilterLayout,
  },
  {
    path: "/sentiment",
    component: SentimentLayout,
  },
  {
    path: "/randommessage",
    component: RandomLayout,
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
