// src/components/Navbar.server.tsx
import {fetchGraphQL} from "@/lib/strapi/fetchGraphql";
import NavbarClient from "./Navbar.client";

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

export default async function Navbar() {
  const data = await fetchGraphQL(LIST_MENU_ITEMS);

  const menuItems = data?.menus[0].Menu_connection.nodes;

  console.log(menuItems);

  return <NavbarClient menuItems={menuItems} />;
}
