'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Stack, Paper } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Selecione uma opção
        </Typography>

        <Stack spacing={2} mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/despesas')}
            fullWidth
          >
            Gerenciar Despesas
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push('/receitas')}
            fullWidth
          >
            Gerenciar Receitas
          </Button>


        </Stack>
      </Paper>
    </Container>
  );
}