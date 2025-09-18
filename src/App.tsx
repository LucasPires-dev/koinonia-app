import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  Bell, 
  Filter,
  Search,
  ChevronRight,
  Clock,
  AlertTriangle,
  Heart,
  Book,
  User,
  Home,
  Briefcase,
  Plus,
  Phone,
  MapPin,
  Star,
  CheckCircle
} from 'lucide-react';



const Koinonia = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const categories = [
    { id: 'todos', name: 'Todos', icon: MessageSquare, count: 47, color: 'bg-blue-500' },
    { id: 'relacionamentos', name: 'Relacionamentos', icon: Heart, count: 12, color: 'bg-pink-500' },
    { id: 'deus', name: 'Relacionamento com Deus', icon: Star, count: 8, color: 'bg-yellow-500' },
    { id: 'biblia', name: 'Dúvidas Bíblicas', icon: Book, count: 6, color: 'bg-green-500' },
    { id: 'pessoal', name: 'Crescimento Pessoal', icon: User, count: 9, color: 'bg-purple-500' },
    { id: 'familia', name: 'Questões Familiares', icon: Home, count: 7, color: 'bg-orange-500' },
    { id: 'emergencia', name: 'Emergências', icon: AlertTriangle, count: 3, color: 'bg-red-500' },
    { id: 'profissional', name: 'Vida Profissional', icon: Briefcase, count: 2, color: 'bg-indigo-500' }
  ];

  const messages = [
    {
      id: 1,
      name: 'Maria Santos',
      phone: '+55 21 99999-1234',
      category: 'relacionamentos',
      urgency: 'alta',
      lastMessage: 'Pastor, preciso de oração urgente. Meu casamento está passando por uma crise muito difícil...',
      timestamp: '2 min atrás',
      unread: 3,
      sentiment: 'negativo',
      aiSummary: 'Crise matrimonial, pedido de oração e aconselhamento urgente'
    },
    {
      id: 2,
      name: 'João Silva',
      phone: '+55 21 99999-5678',
      category: 'deus',
      urgency: 'media',
      lastMessage: 'Bom dia pastor! Estou passando por um momento de frieza espiritual e gostaria de conversar...',
      timestamp: '15 min atrás',
      unread: 1,
      sentiment: 'neutro',
      aiSummary: 'Frieza espiritual, busca por direcionamento'
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      phone: '+55 21 99999-9012',
      category: 'biblia',
      urgency: 'baixa',
      lastMessage: 'Pastor, tenho uma dúvida sobre a passagem de Romanos 8:28. Poderia me explicar melhor?',
      timestamp: '1 hora atrás',
      unread: 1,
      sentiment: 'positivo',
      aiSummary: 'Dúvida bíblica específica sobre Romanos 8:28'
    },
    {
      id: 4,
      name: 'Pedro Costa',
      phone: '+55 21 99999-3456',
      category: 'emergencia',
      urgency: 'critica',
      lastMessage: 'Pastor, minha mãe está internada no hospital. Por favor, ore por ela. Situação grave.',
      timestamp: '5 min atrás',
      unread: 2,
      sentiment: 'negativo',
      aiSummary: 'Emergência médica familiar, pedido de oração urgente'
    }
  ];

  const appointments = [
    {
      id: 1,
      type: 'visita',
      title: 'Visita à família Rodrigues',
      person: 'Carlos Rodrigues',
      address: 'Rua das Flores, 123 - Centro',
      date: '2024-09-19',
      time: '14:00',
      notes: 'Família passando por dificuldades financeiras. Levar cesta básica.',
      priority: 'alta'
    },
    {
      id: 2,
      type: 'aconselhamento',
      title: 'Aconselhamento Matrimonial',
      person: 'Casal Ferreira',
      address: 'Igreja - Sala de Aconselhamento',
      date: '2024-09-20',
      time: '19:30',
      notes: 'Terceira sessão. Progresso positivo na comunicação.',
      priority: 'media'
    },
    {
      id: 3,
      type: 'reuniao',
      title: 'Reunião com Diretoria',
      person: 'Conselho da Igreja',
      address: 'Igreja - Sala de Reuniões',
      date: '2024-09-21',
      time: '10:00',
      notes: 'Discussão sobre projetos de expansão e orçamento anual.',
      priority: 'alta'
    }
  ];

  const getUrgencyColor = (urgency:string) => {
    switch(urgency) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentColor = (sentiment:string) => {
    switch(sentiment) {
      case 'positivo': return 'text-green-600';
      case 'neutro': return 'text-yellow-600';
      case 'negativo': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesCategory = selectedCategory === 'todos' || msg.category === selectedCategory;
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalUnread = messages.reduce((sum, msg) => sum + msg.unread, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Koinonia</h1>
              </div>
              <span className="text-sm text-gray-500">Dashboard Pastoral Inteligente</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Pastor João</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Mensagens</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('contatos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contatos' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Contatos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'agenda' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Agenda</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Categories */}
        {activeTab === 'dashboard' && (
          <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="p-6">
              {/* Search and Stats */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedCategory === 'todos' ? 'Todas as Mensagens' : 
                     categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Buscar mensagens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total de Mensagens</p>
                        <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Não Lidas</p>
                        <p className="text-2xl font-bold text-orange-600">{totalUnread}</p>
                      </div>
                      <Bell className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Urgentes</p>
                        <p className="text-2xl font-bold text-red-600">
                          {messages.filter(m => m.urgency === 'critica' || m.urgency === 'alta').length}
                        </p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Respondidas Hoje</p>
                        <p className="text-2xl font-bold text-green-600">12</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{message.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(message.urgency)}`}>
                              {message.urgency.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{message.phone}</p>
                          <p className="text-gray-800 mb-2">{message.lastMessage}</p>
                          <div className="bg-blue-50 p-3 rounded-lg mb-2">
                            <p className="text-sm text-blue-800">
                              <strong>IA:</strong> {message.aiSummary}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">{message.timestamp}</p>
                        {message.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {message.unread} não lida{message.unread > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${getSentimentColor(message.sentiment)}`}>
                          Sentimento: {message.sentiment}
                        </span>
                        <span className="text-sm text-gray-500">
                          Categoria: {categories.find(c => c.id === message.category)?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Responder
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Agendar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contatos' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Gestão de Contatos</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Novo Contato
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.map((contact) => (
                      <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Mensagens:</span>
                            <span className="text-sm font-medium text-gray-900">{contact.unread + 15}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Última conversa:</span>
                            <span className="text-sm font-medium text-gray-900">{contact.timestamp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Categoria principal:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {categories.find(c => c.id === contact.category)?.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-2">Resumo IA:</p>
                          <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded">
                            {contact.aiSummary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Agenda Pastoral</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Novo Agendamento
                </button>
              </div>

              <div className="grid gap-6">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.priority === 'alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="text-sm">{appointment.person}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{appointment.address}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Observações:</strong> {appointment.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Reagendar
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Confirmar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Koinonia;