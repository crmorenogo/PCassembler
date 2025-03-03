'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const ProfileCard = ({ title, children }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
      {title}
    </h2>
    {children}
  </div>
);

const ConfigurationCard = ({ config, index }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Configuración {index + 1}
        </h3>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        ${config.totalPrice}
      </p>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Tarjeta Madre:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.motherboard || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Procesador:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.cpu || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Tarjeta Gráfica:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.gpu || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Memoria RAM:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.ram || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Disco Duro:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.storage || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Fuente:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.psu || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Gabinete:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.case || 'No seleccionado'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Monitor:</span>
        <span className="text-gray-900 dark:text-white font-medium">{config.monitor || 'No seleccionado'}</span>
      </div>
    </div>
  </div>
);

const mockUserData = {
  nombre: "Juan Pérez",
  correo: "juan@example.com"
};

const mockConfigurations = [
  {
    id: 1,
    date: "2024-03-15",
    type: "gaming",
    totalPrice: "2500",
    motherboard: "ASUS ROG STRIX B550-F",
    cpu: "AMD Ryzen 7 5800X",
    gpu: "NVIDIA RTX 3080",
    ram: "32GB DDR4 3600MHz",
    storage: "1TB NVMe SSD",
    psu: "850W 80+ Gold",
    case: "Lian Li PC-O11",
    monitor: "27\" 1440p 165Hz"
  },
  {
    id: 2,
    date: "2024-03-10",
    type: "workstation",
    totalPrice: "3200",
    motherboard: "ASUS ProArt X570",
    cpu: "AMD Ryzen 9 5950X",
    gpu: "NVIDIA RTX 4090",
    ram: "64GB DDR4 3200MHz",
    storage: "2TB NVMe SSD",
    psu: "1000W 80+ Platinum",
    case: "Fractal Design Define 7",
    monitor: "32\" 4K IPS"
  },
  {
    id: 3,
    date: "2024-03-05",
    type: "streaming",
    totalPrice: "1800",
    motherboard: "MSI B550 Gaming Plus",
    cpu: "AMD Ryzen 5 5600X",
    gpu: "NVIDIA RTX 3060 Ti",
    ram: "32GB DDR4 3200MHz",
    storage: "1TB NVMe SSD",
    psu: "750W 80+ Gold",
    case: "NZXT H510",
    monitor: "27\" 1080p 240Hz"
  },
  {
    id: 4,
    date: "2024-03-01",
    type: "basic",
    totalPrice: "800",
    motherboard: "ASRock B450M Pro4",
    cpu: "AMD Ryzen 3 3300X",
    gpu: "NVIDIA GTX 1660 Super",
    ram: "16GB DDR4 3000MHz",
    storage: "500GB SSD",
    psu: "550W 80+ Bronze",
    case: "Cooler Master MB311L",
    monitor: "24\" 1080p 75Hz"
  }
];

const ProfilePage = () => {
  const { token } = useAuth();
  const [userData] = useState(mockUserData);
  const [configurations] = useState(mockConfigurations);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus configuraciones de PC</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Información del Usuario */}
          <div className="lg:col-span-1">
            <ProfileCard title="Información Personal">
              {userData && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData.nombre}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Correo</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{userData.correo}</p>
                    </div>
                  </div>
                </div>
              )}
            </ProfileCard>
          </div>

          {/* Configuraciones Guardadas */}
          <div className="lg:col-span-3">
            <ProfileCard title="Mis Configuraciones">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : configurations.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {configurations.map((config, index) => (
                    <ConfigurationCard key={config.id} config={config} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    No tienes configuraciones guardadas.{' '}
                    <a href="/armar-pc" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      ¡Crea tu primera configuración!
                    </a>
                  </p>
                </div>
              )}
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileWithAuth = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
};

export default ProfileWithAuth; 