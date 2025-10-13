import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        placeholder="Məhsul axtar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{
          style: {
            fontSize: '16px', // Prevent iOS zoom
            WebkitAppearance: 'none', // Remove iOS styling
            WebkitBorderRadius: '0', // Remove iOS border radius
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon size={20} color="rgba(255, 255, 255, 0.5)" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 2.5,
            color: '#FFFFFF',
            height: 44,
            fontSize: '16px', // Prevent iOS zoom - must be 16px or larger
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
            },
            '& fieldset': {
              border: 'none',
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
            fontWeight: 400,
            fontSize: '16px', // Prevent iOS zoom - must be 16px or larger
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 400,
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;