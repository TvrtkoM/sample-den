import { Button, Container, Head, Heading, Html, Tailwind, Text } from 'react-email'

const ResetPasswordEmail = ({ resetUrl, username }: { resetUrl: string; username: string }) => {
  return (
    <Html>
      <Head>
        <title>Reset Password</title>
      </Head>
      <Tailwind>
        <Container>
          <Heading as="h2">Reset Your Password</Heading>
          <Text>Hello {username},</Text>
          <Text>We received a request to reset your password. Click the button below to choose a new one:</Text>
          <Button href={resetUrl} className="px-2 py-1 cursor-pointer bg-blue-500 text-white">
            Reset Password
          </Button>
          <Text>{"If you didn't request a password reset, please ignore this email."}</Text>
          <Text>This link will expire in 1 hour.</Text>
          <Text>Best regards,</Text>
          <Text>Sampleden team</Text>
        </Container>
      </Tailwind>
    </Html>
  )
}

export default ResetPasswordEmail
