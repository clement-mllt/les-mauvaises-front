import {fetchGraphQL} from "@/lib/strapi/fetchGraphql";

const query = `
query Articles {
  articles {
    category {
      name
    }
    cover {
      url
    }
    tags_connection {
      nodes {
        tag
      }
    }
    title
    updatedAt
  }
}
`;

export default async function HomePage() {
    const data = await fetchGraphQL<{articles: any}>(query);

    if (!data || !data.articles) {
        return (
            <span className="text-5xl container flex items-center justify-center">
                Skeleton
            </span>
        );
    }

    return (
        <div>
            {data.articles.map((article: any, index: number) => (
                <div key={index}>
                    <h2>{article.title}</h2>
                    <p>Category: {article.category?.name}</p>
                    <img src={article.cover?.url} alt={article.title} />
                    <p>Tags: {article.tags_connection?.nodes.map((node: any) => node.tag).join(", ")}</p>
                    <p>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}
