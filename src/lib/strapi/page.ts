// src/lib/strapi/page.ts
import {fetchGraphQL} from "@/lib/strapi/fetchGraphql";

const GET_PAGE_WITH_SLUG = `
  query GetPageWithSlug($filters: PageFiltersInput) {
    pages(filters: $filters) {
      Title
    }
  }
`;
interface PageResponse {
  pages: {Title: string}[];
}

export async function fetchPageContent(slug: string) {
  const variables = {
    filters: {
      slug: {
        eq: slug,
      },
    },
  };

  const data = await fetchGraphQL<PageResponse>(GET_PAGE_WITH_SLUG, variables);

  return data?.pages[0];
}
