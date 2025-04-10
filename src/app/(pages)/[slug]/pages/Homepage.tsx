// src/components/pages/Homepage.tsx
import React from "react";
import { fetchGraphQL } from "@/lib/strapi/fetchGraphql";
import { PageResponse } from "@/lib/strapi/types";

import { HomeHeader } from "@/components/Home/_sections/HomeHeader.client";
import { HomeCleinDoeil } from "@/components/Home/_sections/HomeCleinDoeil.client";
import { HomeCuriosity } from "@/components/Home/_sections/HomeCuriosity.client";
import { ScrollPinSections } from "@/components/Home/utils/ScrollPinSections";
import { HomeMotsCroise } from "@/components/Home/_sections/HomeMotsCroise.client";

import style from "@/app/styles/components/Homepage.module.scss";

const GET_PAGE_WITH_SLUG = `
    query Menu($documentId: ID!) {
      page(documentId: $documentId) {
        Title
        documentId
        slug
        header_video {
          ... on ComponentSharedHomeHeader {
            header_video {
              url
            }
          }
        }
      }
    }
  `;



export default async function Homepage() {

  const pageData = await fetchGraphQL<PageResponse>(GET_PAGE_WITH_SLUG, {
      documentId: "nfew7oqsfo6vumap1dk2nmdc",
    }
  );

  console.log("Page Data:", pageData);
  

  return (
    <section className={style.homepage}>
      <ScrollPinSections />

      <HomeHeader data={pageData?.page?.header_video}/>
      <HomeCleinDoeil />
      <HomeCuriosity />
      <HomeMotsCroise />
    </section>
  );
}
