import { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Calendar as CalendarIcon, 
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
  CheckCircle,
  ChevronLeft,
  TrendingUp,
  Activity,
  Target,
  Zap
} from 'lucide-react';

// ==================== DADOS MOCK ====================
const mockData = {
  categories: [
    { id: 'todos', name: 'Todos', icon: MessageSquare, count: 47, color: 'bg-blue-500' },
    { id: 'urgentes', name: 'Urgentes', icon: AlertTriangle, count: 5, color: 'bg-red-500' },
    { id: 'relacionamentos', name: 'Relacionamentos', icon: Heart, count: 12, color: 'bg-pink-500' },
    { id: 'deus', name: 'Vida Espiritual', icon: Star, count: 8, color: 'bg-yellow-500' },
    { id: 'biblia', name: 'Dúvidas Bíblicas', icon: Book, count: 6, color: 'bg-green-500' },
    { id: 'pessoal', name: 'Crescimento', icon: User, count: 9, color: 'bg-purple-500' },
    { id: 'familia', name: 'Família', icon: Home, count: 7, color: 'bg-orange-500' },
    { id: 'profissional', name: 'Profissional', icon: Briefcase, count: 2, color: 'bg-indigo-500' }
  ],
  messages: [
    {
      id: 1,
      name: 'Maria Santos',
      phone: '+55 21 99999-1234',
      category: 'relacionamentos',
      urgency: 'alta',
      lastMessage: 'Pastor, preciso de oração urgente. Meu casamento está passando por uma crise muito difícil...',
      timestamp: new Date(Date.now() - 2 * 60000),
      unread: 3,
      sentiment: 'negativo',
      aiSummary: 'Crise matrimonial, pedido de oração e aconselhamento urgente',
      whatsappStatus: 'online'
    },
    {
      id: 2,
      name: 'João Silva',
      phone: '+55 21 99999-5678',
      category: 'deus',
      urgency: 'media',
      lastMessage: 'Bom dia pastor! Estou passando por um momento de frieza espiritual...',
      timestamp: new Date(Date.now() - 15 * 60000),
      unread: 1,
      sentiment: 'neutro',
      aiSummary: 'Frieza espiritual, busca por direcionamento',
      whatsappStatus: 'away'
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      phone: '+55 21 99999-9012',
      category: 'biblia',
      urgency: 'baixa',
      lastMessage: 'Pastor, tenho uma dúvida sobre a passagem de Romanos 8:28...',
      timestamp: new Date(Date.now() - 60 * 60000),
      unread: 1,
      sentiment: 'positivo',
      aiSummary: 'Dúvida bíblica específica sobre Romanos 8:28',
      whatsappStatus: 'offline'
    },
    {
      id: 4,
      name: 'Pedro Costa',
      phone: '+55 21 99999-3456',
      category: 'urgentes',
      urgency: 'critica',
      lastMessage: 'Pastor, minha mãe está internada no hospital. Por favor, ore por ela.',
      timestamp: new Date(Date.now() - 5 * 60000),
      unread: 2,
      sentiment: 'negativo',
      aiSummary: 'Emergência médica familiar, pedido de oração urgente',
      whatsappStatus: 'online'
    }
  ],
  appointments: [
    {
      id: 1,
      type: 'visita',
      title: 'Visita à família Rodrigues',
      person: 'Carlos Rodrigues',
      address: 'Rua das Flores, 123 - Centro',
      date: new Date(2024, 11, 19, 14, 0),
      notes: 'Família passando por dificuldades financeiras. Levar cesta básica.',
      priority: 'alta',
      duration: 60,
      confirmed: true
    },
    {
      id: 2,
      type: 'aconselhamento',
      title: 'Aconselhamento Matrimonial',
      person: 'Casal Ferreira',
      address: 'Igreja - Sala de Aconselhamento',
      date: new Date(2024, 11, 20, 19, 30),
      notes: 'Terceira sessão. Progresso positivo na comunicação.',
      priority: 'media',
      duration: 90,
      confirmed: true
    },
    {
      id: 3,
      type: 'reuniao',
      title: 'Reunião com Diretoria',
      person: 'Conselho da Igreja',
      address: 'Igreja - Sala de Reuniões',
      date: new Date(2024, 11, 21, 10, 0),
      notes: 'Discussão sobre projetos de expansão e orçamento anual.',
      priority: 'alta',
      duration: 120,
      confirmed: false
    }
  ],
  calendarEvents: [
    { date: new Date(2024, 11, 19), type: 'visita', count: 2, title: 'Visitas Familiares' },
    { date: new Date(2024, 11, 20), type: 'aconselhamento', count: 3, title: 'Sessões de Aconselhamento' },
    { date: new Date(2024, 11, 21), type: 'reuniao', count: 1, title: 'Reunião de Liderança' },
    { date: new Date(2024, 11, 22), type: 'culto', count: 1, title: 'Culto Dominical' },
    { date: new Date(2024, 11, 25), type: 'visita', count: 1, title: 'Visita Hospitalar' },
    { date: new Date(2024, 11, 27), type: 'aconselhamento', count: 2, title: 'Aconselhamento' }
  ],
  metrics: {
    totalMembros: 247,
    ativos: 189,
    novos: 12,
    inativos: 46,
    mensagensHoje: 23,
    compromissosHoje: 3,
    taxaResposta: 87
  }
};

// ==================== COMPONENTE: HEADER ====================
const Header = ({ totalUnread }) => (
  <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Koinonia</h1>
              <p className="text-xs text-gray-500">Sistema de Gestão Pastoral</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Pastor João</p>
              <p className="text-xs text-gray-500">Igreja Batista Central</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center ring-2 ring-blue-300">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
            {totalUnread > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                {totalUnread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>
);

// ==================== COMPONENTE: NAVEGAÇÃO ====================
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'mensagens', icon: MessageSquare, label: 'Mensagens' },
    { id: 'contatos', icon: Users, label: 'Membros' },
    { id: 'agenda', icon: CalendarIcon, label: 'Agenda' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
      <div className="px-6">
        <div className="flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// ==================== COMPONENTE: CARD DE MÉTRICA ====================
const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-8 h-8 opacity-80" />
      <TrendingUp className="w-5 h-5" />
    </div>
    <p className="text-white opacity-80 text-sm mb-1">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-white opacity-80 text-xs mt-2">{subtitle}</p>
  </div>
);

// ==================== COMPONENTE: DASHBOARD ====================
const Dashboard = ({ metrics, messages, appointments, setActiveTab }) => {
  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h2>
      
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          icon={Users}
          title="Total de Membros"
          value={metrics.totalMembros}
          subtitle={`+${metrics.novos} novos este mês`}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard 
          icon={Activity}
          title="Membros Ativos"
          value={metrics.ativos}
          subtitle={`${Math.round(metrics.ativos/metrics.totalMembros*100)}% do total`}
          color="from-green-500 to-green-600"
        />
        <MetricCard 
          icon={MessageSquare}
          title="Mensagens Hoje"
          value={metrics.mensagensHoje}
          subtitle={`${messages.reduce((sum, m) => sum + m.unread, 0)} não lidas`}
          color="from-orange-500 to-orange-600"
        />
        <MetricCard 
          icon={CalendarIcon}
          title="Compromissos Hoje"
          value={metrics.compromissosHoje}
          subtitle="Próximo em 2h"
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Resumo de atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mensagens urgentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mensagens Urgentes</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {messages.filter(m => m.urgency === 'critica' || m.urgency === 'alta').slice(0, 3).map(msg => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{msg.name}</p>
                  <p className="text-xs text-gray-600 truncate">{msg.lastMessage}</p>
                  <p className="text-xs text-red-600 mt-1">{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab('mensagens')}
            className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          >
            Ver todas as mensagens
          </button>
        </div>

        {/* Próximos compromissos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Compromissos</h3>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {appointments.slice(0, 3).map(apt => (
              <div key={apt.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{apt.title}</p>
                  <p className="text-xs text-gray-600">{apt.person}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {apt.date.toLocaleDateString('pt-BR')} às {apt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab('agenda')}
            className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          >
            Ver agenda completa
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE: SIDEBAR CATEGORIAS ====================
const CategorySidebar = ({ categories, selectedCategory, setSelectedCategory }) => (
  <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-145px)] overflow-y-auto sticky top-[145px]">
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
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                selectedCategory === category.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm scale-105' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 ${category.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-sm">{category.name}</span>
              </div>
              <span className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold">
                {category.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

// ==================== COMPONENTE: CARD DE MENSAGEM ====================
const MessageCard = ({ message, categories }) => {
  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-300';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positivo': return 'text-green-600';
      case 'neutro': return 'text-yellow-600';
      case 'negativo': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              message.whatsappStatus === 'online' ? 'bg-green-500' :
              message.whatsappStatus === 'away' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`}></div>
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
          <p className="text-sm text-gray-500 mb-2">{formatTime(message.timestamp)}</p>
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
            <CalendarIcon className="w-4 h-4 inline mr-2" />
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE: ABA MENSAGENS ====================
const MessagesTab = ({ messages, categories, selectedCategory, searchTerm, setSearchTerm }) => {
  const filteredMessages = messages.filter(msg => {
    const matchesCategory = selectedCategory === 'todos' || msg.category === selectedCategory || 
                           (selectedCategory === 'urgentes' && (msg.urgency === 'critica' || msg.urgency === 'alta'));
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalUnread = messages.reduce((sum, msg) => sum + msg.unread, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedCategory === 'todos' ? 'Todas as Mensagens' : 
             categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome ou mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-sm text-gray-600">Respondidas</p>
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
          <MessageCard key={message.id} message={message} categories={categories} />
        ))}
      </div>
    </div>
  );
};

// ==================== COMPONENTE: CALENDÁRIO ====================
const CalendarView = ({ currentDate, setCurrentDate, selectedDate, setSelectedDate, calendarEvents }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const hasEvent = (date) => {
    return calendarEvents.find(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = [];
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Dias em branco antes do início do mês
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const event = hasEvent(date);
    const isToday = isSameDay(date, new Date());
    const isSelected = isSameDay(date, selectedDate);

    days.push(
      <button
        key={day}
        onClick={() => setSelectedDate(date)}
        className={`p-2 rounded-lg relative transition-all ${
          isSelected ? 'bg-blue-600 text-white' :
          isToday ? 'bg-blue-100 text-blue-900 font-bold' :
          event ? 'bg-green-50 hover:bg-green-100' :
          'hover:bg-gray-100'
        }`}
      >
        <div className="text-sm">{day}</div>
        {event && (
          <div className="flex justify-center gap-1 mt-1">
            {Array.from({ length: Math.min(event.count, 3) }).map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${
                event.type === 'visita' ? 'bg-orange-500' :
                event.type === 'aconselhamento' ? 'bg-purple-500' :
                event.type === 'reuniao' ? 'bg-blue-500' :
                'bg-green-500'
              }`}></div>
            ))}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Hoje
          </button>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Legenda</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Visitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-600">Aconselhamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Reuniões</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Cultos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE: CARD DE COMPROMISSO ====================
const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              appointment.priority === 'alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {appointment.priority.toUpperCase()}
            </span>
            {appointment.confirmed && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
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
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">{appointment.date.toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{appointment.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ({appointment.duration} min)</span>
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
  );
};

// ==================== COMPONENTE: ABA AGENDA ====================
const AgendaTab = ({ appointments, selectedDate, currentDate, setCurrentDate, setSelectedDate, calendarEvents }) => {
  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    ).sort((a, b) => a.date - b.date);
  };

  const dayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Agenda Pastoral</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-1">
          <CalendarView 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarEvents={calendarEvents}
          />
        </div>

        {/* Lista de compromissos do dia selecionado */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compromissos - {selectedDate.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </h3>
            {dayAppointments.length > 0 ? (
              <p className="text-sm text-gray-600">{dayAppointments.length} compromisso(s) agendado(s)</p>
            ) : (
              <p className="text-sm text-gray-500">Nenhum compromisso para este dia</p>
            )}
          </div>

          <div className="space-y-6">
            {dayAppointments.length > 0 ? (
              dayAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhum compromisso para este dia</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Criar Agendamento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE: ABA CONTATOS ====================
const ContatosTab = ({ messages, categories }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestão de Membros</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          Novo Membro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      contact.whatsappStatus === 'online' ? 'bg-green-500' :
                      contact.whatsappStatus === 'away' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></div>
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
                    <span className="text-sm text-gray-600">Categoria:</span>
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

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    <Phone className="w-3 h-3 inline mr-1" />
                    Ligar
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const Koinonia = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { categories, messages, appointments, calendarEvents, metrics } = mockData;
  const totalUnread = messages.reduce((sum, msg) => sum + msg.unread, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header totalUnread={totalUnread} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex">
        {activeTab === 'mensagens' && (
          <CategorySidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        <div className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              metrics={metrics}
              messages={messages}
              appointments={appointments}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'mensagens' && (
            <MessagesTab 
              messages={messages}
              categories={categories}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {activeTab === 'contatos' && (
            <ContatosTab 
              messages={messages}
              categories={categories}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaTab 
              appointments={appointments}
              selectedDate={selectedDate}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              setSelectedDate={setSelectedDate}
              calendarEvents={calendarEvents}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Koinonia;