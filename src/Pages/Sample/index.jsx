// components/BrandsSimple.jsx
import React, { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Box,
} from '@mui/material'
import { Search } from '@mui/icons-material'

export default function BrandsSimple() {
  const [searchTerm, setSearchTerm] = useState('')

  console.log('✅ BrandsSimple rendered')

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        تست کردن ساده برندها
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="جستجو....."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Typography>عبارت جستجو:   {searchTerm}</Typography>
      </Box>
    </Container>
  )
}