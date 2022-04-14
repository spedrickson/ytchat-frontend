import UserLayout from "layouts/UserLayout";
import FilterLayout from "layouts/FilterLayout";
import MessageHistory from "components/MessageHistory";
import ModComments from "components/ModComments";
import UnbanLayout from "layouts/UnbanLayout";
const routes = [
  {
    name: "channel view",
    path: "/user",
    component: UserLayout,
    children: [
      {
        path: ":channelID",
        component: MessageHistory,
        alias: ":channelID/messages"
      },{
        path: ":channelID/messages",
        component: MessageHistory,
      },{
        path: ":channelID/modcomments",
        component: ModComments,
    },]
  },{
    path: "/filtered",
    component: FilterLayout
  },{
    name: "Unban Form",
    path: "/unban",
    component: UnbanLayout,
    children: [
      {
        // component: UnbanForm,
        path: ":channelID",
      }
    ]
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
