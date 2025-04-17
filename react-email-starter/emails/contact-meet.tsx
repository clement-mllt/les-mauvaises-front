import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import {text} from "stream/consumers";

interface NotionMagicLinkEmailProps {
  loginCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const NotionMagicLinkEmail = ({
  loginCode,
}: NotionMagicLinkEmailProps) => (
  <Html>
    <Head>
      {/* Import custom font */}
      <style>
        {`
                    @font-face {
                      font-family: 'Les Mauvaises';
                      src: url('${baseUrl}/static/fonts/LesMauvaises.woff2') format('woff2');
                      font-weight: normal;
                      font-style: normal;
                    }

                    @font-face {
                      font-family: 'MadeSoulmaze';
                      src: url('${baseUrl}/static/fonts/MadeSoulmaze.woff2') format('woff2');
                      font-weight: normal;
                      font-style: normal;
                    }
                    @font-face {
                      font-family: 'Quicksand';
                      src: url('${baseUrl}/static/fonts/Quicksand.woff2') format('woff2');
                      font-weight: normal;
                      font-style: normal;
                    }
                `}
      </style>
    </Head>
    <Preview>Meet google avec Les Mauvaises</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/favicon-vert.png`}
          width="120"
          height="120"
          alt="Logo Les Mauvaises"
          style={{
            margin: "0 auto",
          }}
        />
        <Heading style={h1}>Salut Clément</Heading>
        <Text style={paragraphe}>
          C'est bientôt l'heure de ta réunion avec Les Mauvaises.
        </Text>

        <Container style={{margin: "60px 0", textAlign: "center"}}>
          <Text style={paragraphe}>
            Clique sur le lien ci-dessous pour rejoindre la réunion Google Meet.
          </Text>
        </Container>

        <Text style={footer}>
          <Link
            href="https://les-mauvaises.fr"
            target="_blank"
            style={{...link, color: "#898989"}}
          >
            les-mauvaises.fr
          </Link>
          , l'agence créative du coin
          <br />
          55 Boulevard du Havre, 95220 Herblay-sur-Seine
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NotionMagicLinkEmail;

const main = {
  backgroundColor: "white",
};

const container: React.CSSProperties = {
  paddingLeft: "12px",
  paddingRight: "12px",
  width: "100%",
  margin: "40px auto",
};

const h1: React.CSSProperties = {
  color: "#28282d",
  fontFamily: "'MadeSoulmaze', sans-serif", // Use the custom font
  fontSize: "40px",
  textAlign: "center",
  margin: "40px auto 0 auto",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily: "'MyCustomFont', sans-serif", // Use the custom font
  fontSize: "14px",
  textDecoration: "underline",
};

const paragraphe: React.CSSProperties = {
  color: "#28282d",
  fontFamily: "'Quicksand', sans-serif", // Use the custom font
  fontSize: "14px",
  opacity: 0.75,
  textAlign: "center" as React.CSSProperties["textAlign"],
  margin: "5px auto 24px auto",
};

const footer = {
  color: "#898989",
  fontFamily: "'MyCustomFont', sans-serif", // Use the custom font
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
function rgba(arg0: number, arg1: number, arg2: number, arg3: number) {
  throw new Error("Function not implemented.");
}
