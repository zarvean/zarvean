
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      console.log('Login successful, navigating to admin panel');
      navigate('/admin')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-container py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-2xl font-serif font-semibold mb-4">ZARVEAN</h1>
            </Link>
            <p className="text-muted-foreground">Welcome to your account</p>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="login">Sign In</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    {...loginForm.register('email')}
                    className={loginForm.formState.errors.email ? 'border-destructive' : ''}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    {...loginForm.register('password')}
                    className={loginForm.formState.errors.password ? 'border-destructive' : ''}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="btn-hero w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <Button variant="link" size="sm">Forgot your password?</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Auth
