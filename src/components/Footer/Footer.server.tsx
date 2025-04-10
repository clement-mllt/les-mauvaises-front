// src/components/Navbar.server.tsx
import {fetchGraphQL} from "@/lib/strapi/fetchGraphql";
import FooterClient from "./Footer.client";

const LIST_MENU_ITEMS = `
  query ListMenuItems {
    menus {
      Menu_connection {
        nodes {
          Title
          slug
        }
      }
    }
  }
`;

export default async function Footer() {
  const data = await fetchGraphQL(LIST_MENU_ITEMS);

  const menuItems = data?.menus[1].Menu_connection.nodes;

  console.log(menuItems);

  return <FooterClient menuItems={menuItems} />;
}
