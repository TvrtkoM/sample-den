import {
  Button,
  Container,
  Head,
  Heading,
  Html,
  Tailwind,
  Text
} from "@react-email/components";

const VerificationEmail = ({
  verificationUrl
}: {
  verificationUrl: string;
}) => {
  return (
    <Html>
      <Head>
        <title>Verify e-mail</title>
      </Head>
      <Tailwind>
        <Container>
          <Heading as="h2">Verify your e-mail</Heading>
          <Text>Click on the button bellow to verify your e-mail</Text>
          <Button
            href={verificationUrl}
            className="px-2 py-1 cursor-pointer bg-blue-500 text-white"
          >
            Verify
          </Button>
        </Container>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
