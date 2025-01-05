import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
    id: string
    username: string
    email: string
    role: string
}

interface AuthState {
    token: string | null
    user: User | null
    isAuthenticated: boolean
    setAuth: (token: string, user: User) => void
    logout: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setAuth: (token: string, user: User) =>
                set((state) => ({
                    ...state,
                    token,
                    user,
                    isAuthenticated: true,
                })),
            logout: () =>
                set((state) => ({
                    ...state,
                    token: null,
                    user: null,
                    isAuthenticated: false,
                })),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export const useAuth = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const setAuth = useAuthStore((state) => state.setAuth)
    const logout = useAuthStore((state) => state.logout)

    return {
        isAuthenticated,
        user,
        token,
        setAuth,
        logout,
    }
}

export default useAuthStore 