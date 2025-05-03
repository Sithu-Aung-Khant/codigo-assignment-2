import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface initialStateTypes {
  isDarkMode: boolean;
}

const initialState: initialStateTypes = {
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsDarkMode } = globalSlice.actions;

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated:
    typeof window !== 'undefined'
      ? !!localStorage.getItem('auth_token')
      : false,
  user:
    typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.username;
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', action.payload.username);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
  },
});

export const { login, logout } = authSlice.actions;

export interface Team {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
  playerCount: number;
  country: string;
}

export interface TeamsState {
  teams: Team[];
}

const initialTeamsState: TeamsState = {
  teams: [],
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: initialTeamsState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams = [action.payload, ...state.teams];
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(
        (team) => team.id === action.payload.id
      );
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
    },
    deleteTeam: (state, action: PayloadAction<number>) => {
      console.log('Deleting team with ID:', action.payload);
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      console.log('Updated teams:', state.teams);
    },
  },
});

export const { addTeam, updateTeam, deleteTeam } = teamsSlice.actions;

// Export the reducers as named exports
export const globalReducer = globalSlice.reducer;
export const authReducer = authSlice.reducer;
export const teamsReducer = teamsSlice.reducer;
