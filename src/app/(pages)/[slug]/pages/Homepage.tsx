// src/components/pages/Homepage.tsx
import React from "react";
import "@/app/styles/components/Homepage.module.scss";
import {fetchGraphQL} from "@/lib/strapi/fetchGraphql";

import {HomeHeader} from "@/components/Home/_sections/HomeHeader.client";
import {HomeCleinDoeil} from "@/components/Home/_sections/HomeCleinDoeil.client";
import {HomeCuriosity} from "@/components/Home/_sections/HomeCuriosity.client";
import {ScrollPinSections} from "@/components/Home/utils/ScrollPinSections";
import {HomeMotsCroise} from "@/components/Home/_sections/HomeMotsCroise.client";
import {HomeFlag} from "@/components/Home/_sections/HomeFlag.client";
import {HomeRestaurant} from "@/components/Home/_sections/HomeRestaurant.client";

import style from "@/app/styles/components/Homepage.module.scss";

const GET_PAGE_WITH_SLUG = `
    query Page($documentId: ID!) {
      page(documentId: $documentId) {
        Title
        slug
        Sections {
          ... on ComponentHomepageHeader {
            Video {
              url
            }
          }
        }
      }
    }
  `;

export default async function Homepage() {
  const pageData = await fetchGraphQL<any>(GET_PAGE_WITH_SLUG, {
    documentId: "nfew7oqsfo6vumap1dk2nmdc",
  });

  return (
    <section className={style.homepage}>
      <ScrollPinSections />
      <HomeHeader data={pageData?.page?.header_video} />
      <HomeCleinDoeil data={pageData?.page?.header_video} />
      <HomeCuriosity />
      <HomeMotsCroise />
      <HomeFlag />
      <HomeRestaurant />
    </section>
  );
}
