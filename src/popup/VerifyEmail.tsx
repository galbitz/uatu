import { Button, Card, Container, Text } from "@mantine/core";
import { auth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";

export const VerifyEmail = () => {
  const handleSendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      await auth.signOut();
    }
  };

  return (
    <Container>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text>
          Verification e-mail has been sent. Please log out and log back in
          after verification.
        </Text>
        <Button
          fullWidth
          mt="md"
          radius="md"
          onClick={handleSendVerificationEmail}
        >
          Resend verification
        </Button>
      </Card>
    </Container>
  );
};
