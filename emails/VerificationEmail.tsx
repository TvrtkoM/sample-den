import { Button, Container, Head, Heading, Html, Tailwind, Text } from 'react-email'

const VerificationEmail = ({ verificationUrl, username }: { verificationUrl: string; username: string }) => {
  return (
    <Html>
      <Head>
        <title>Verify Email</title>
      </Head>
      <Tailwind>
        <Container>
          <Heading as="h2">Verify Your Email</Heading>
          <Text>Hello {username},</Text>
          <Text>Thank you for signing up! Please verify your email address by clicking the button below:</Text>
          <Button href={verificationUrl} className="px-2 py-1 cursor-pointer bg-blue-500 text-white">
            Verify Email
          </Button>
          <Text>{"If you didn't create an account, please ignore this email."}</Text>
          <Text>This link will expire in 1 hour.</Text>
          <Text>Best regards,</Text>
          <Text>Sampleden team</Text>
        </Container>
      </Tailwind>
    </Html>
  )
}

export default VerificationEmail
