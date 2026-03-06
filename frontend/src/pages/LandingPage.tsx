import { Link } from 'react-router';
import { Book, Users, Clock, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Book className="h-20 w-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sistema de Gerenciamento de Biblioteca
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Gerencie seus livros, clientes e empréstimos de forma simples e eficiente
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login/funcionario">
              <Button size="lg" className="w-full sm:w-auto">
                Acesso Funcionário
              </Button>
            </Link>
            <Link to="/login/cliente">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Acesso Cliente
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Catálogo de Livros</h3>
            <p className="text-gray-600 text-sm">
              Organize e gerencie todo o acervo da biblioteca
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Gestão de Clientes</h3>
            <p className="text-gray-600 text-sm">
              Cadastre e acompanhe todos os usuários
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Controle de Empréstimos</h3>
            <p className="text-gray-600 text-sm">
              Gerencie empréstimos e devoluções facilmente
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Sistema Seguro</h3>
            <p className="text-gray-600 text-sm">
              Acesso controlado para funcionários e clientes
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Novo por aqui?</h2>
          <p className="text-gray-600 mb-6">
            Cadastre-se como cliente para começar a fazer empréstimos
          </p>
          <Link to="/cadastro/cliente">
            <Button size="lg">Criar Conta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
