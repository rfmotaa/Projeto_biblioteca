import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Book, User, Mail, Lock, IdCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { funcionariosApi } from '../services/api';
import { toast } from 'sonner';

export default function FuncionarioCadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    login: '',
    senha: '',
    confirmarSenha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await funcionariosApi.create({
        nome: formData.nome,
        login: formData.login,
        senha: formData.senha,
      });

      toast.success('Cadastro realizado com sucesso!');
      navigate('/login/funcionario');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <Book className="h-12 w-12 text-blue-600" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Cadastro de Funcionário</h2>
          <p className="text-gray-600 mt-2">Crie sua conta de funcionário</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="login">Login</Label>
              <div className="mt-1 relative">
                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Login de acesso"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  required
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="text-sm">
              <Link to="/login/funcionario" className="text-blue-600 hover:underline">
                Já tem conta? Faça login
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/" className="text-gray-600 hover:underline">
                ← Voltar para início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
