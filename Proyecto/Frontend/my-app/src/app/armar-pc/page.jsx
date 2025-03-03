"use client";
import React, { useState, useEffect } from 'react';
import { useBoards } from '@/hooks/useBoards';
import { useCompatibleCPUs } from '@/hooks/useCompatibleCPUs';
import { useCompatibleGPUs } from '@/hooks/useCompatibleGPUs';
import { useCompatibleMemory } from '@/hooks/useCompatibleMemory';
import { useCompatiblePSU } from '@/hooks/useCompatiblePSU';
import { useCompatibleDisks } from '@/hooks/useCompatibleDisks';
import { useCompatibleCases } from '@/hooks/useCompatibleCases';
import { useCompatibleMonitors } from '@/hooks/useCompatibleMonitors';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

const ArmarPcPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  useEffect(() => {
    // Reiniciar todos los estados cuando cambie el type
    setCurrentStep(1);
    setSelectedBoard(null);
    setSelectedCPU(null);
    setSelectedGPU(null);
    setSelectedMemory(null);
    setSelectedPSU(null);
    setSelectedStorage(null);
    setSelectedCase(null);
    setSelectedPeripherals(null);
    setSelectedMonitor(null);
    setFormData({
      procesador: '',
      motherboard: '',
      ram: '',
      almacenamiento: '',
      gpu: '',
      fuente: '',
      gabinete: '',
      monitor: '',
      perifericos: '',
      presupuesto: '',
    });
  }, [type]);

  const { boards, loading: loadingBoards, error: boardsError } = useBoards();

  

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedPeripherals, setSelectedPeripherals] = useState(null);
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  const [formData, setFormData] = useState({
    procesador: '',
    motherboard: '',
    ram: '',
    almacenamiento: '',
    gpu: '',
    fuente: '',
    gabinete: '',
    monitor: '',
    perifericos: '',
    presupuesto: '',
  });

  // Solo llamar a useCompatibleCPUs cuando estemos en el paso 2
  const { cpus, loading: loadingCPUs, error: cpusError } = useCompatibleCPUs(
    currentStep === 2 ? formData.motherboard : null
  );

  // Solo llamar a useCompatibleGPUs cuando estemos en el paso 3
  const { gpus, loading: loadingGPUs, error: gpusError } = useCompatibleGPUs(
    currentStep === 3 ? formData.motherboard : null,
    currentStep === 3 ? formData.procesador : null
  );

  // Solo llamar a useCompatibleMemory cuando estemos en el paso 4
  const { memory, loading: loadingMemory, error: memoryError } = useCompatibleMemory(
    currentStep === 4 ? formData.motherboard : null,
    currentStep === 4 ? formData.procesador : null,
    currentStep === 4 ? formData.gpu : null
  );

  // Solo llamar a useCompatibleDisks cuando estemos en el paso 5
  const { disks, loading: loadingDisks, error: disksError } = useCompatibleDisks(
    currentStep === 5 ? formData.motherboard : null,
    currentStep === 5 ? formData.procesador : null,
    currentStep === 5 ? formData.gpu : null,
    currentStep === 5 ? formData.ram : null
  );

  // Solo llamar a useCompatiblePSU cuando estemos en el paso 6
  const { psus, loading: loadingPSUs, error: psusError } = useCompatiblePSU(
    currentStep === 6 ? formData.motherboard : null,
    currentStep === 6 ? formData.procesador : null,
    currentStep === 6 ? formData.gpu : null,
    currentStep === 6 ? formData.ram : null
  );

  // Solo llamar a useCompatibleCases cuando estemos en el paso 7
  const { cases, loading: loadingCases, error: casesError } = useCompatibleCases(
    currentStep === 7 ? formData.motherboard : null,
    currentStep === 7 ? formData.procesador : null,
    currentStep === 7 ? formData.gpu : null,
    currentStep === 7 ? formData.ram : null,
    currentStep === 7 ? formData.almacenamiento : null,
    currentStep === 7 ? formData.fuente : null
  );

  // Solo llamar a useCompatibleMonitors cuando estemos en el paso 8
  const { monitors, loading: loadingMonitors, error: monitorsError } = useCompatibleMonitors(
    currentStep === 8 ? formData.motherboard : null,
    currentStep === 8 ? formData.procesador : null,
    currentStep === 8 ? formData.gpu : null,
    currentStep === 8 ? formData.ram : null,
    currentStep === 8 ? formData.almacenamiento : null,
    currentStep === 8 ? formData.fuente : null,
    currentStep === 8 ? formData.gabinete : null
  );

  const steps = [
    { number: 1, title: "Tarjeta Madre" },
    { number: 2, title: "Procesador" },
    { number: 3, title: "Tarjeta Grafica" },
    { number: 4, title: "Memoria RAM" },
    { number: 5, title: "Disco Duro" },
    { number: 6, title: "Fuente" },
    { number: 7, title: "Gabinete" },
    { number: 8, title: "Monitor" },
    { number: 9, title: "Resumen" }
  ];

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setFormData(prev => ({
      ...prev,
      motherboard: board.id_componente
    }));
  };

  const handleCPUSelect = (cpu) => {
    setSelectedCPU(cpu);
    setFormData(prev => ({
      ...prev,
      procesador: cpu.id_componente
    }));
  };

  const handleGPUSelect = (gpu) => {
    setSelectedGPU(gpu);
    setFormData(prev => ({
      ...prev,
      gpu: gpu.id_componente
    }));
  };

  const handleMemorySelect = (memoryItem) => {
    setSelectedMemory(memoryItem);
    setFormData(prev => ({
      ...prev,
      ram: memoryItem.id_componente
    }));
  };

  const handlePSUSelect = (psu) => {
    setSelectedPSU(psu);
    setFormData(prev => ({
      ...prev,
      fuente: psu.id_componente
    }));
  };

  const handleStorageSelect = (storage) => {
    setSelectedStorage(storage);
    setFormData(prev => ({
      ...prev,
      almacenamiento: storage.id_componente
    }));
  };

  const handleCaseSelect = (case_) => {
    setSelectedCase(case_);
    setFormData(prev => ({
      ...prev,
      gabinete: case_.id_componente
    }));
  };


  const handleMonitorSelect = (monitor) => {
    setSelectedMonitor(monitor);
    setFormData(prev => ({
      ...prev,
      monitor: monitor.id_componente
    }));
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    console.log(formData);
  };

  // Función auxiliar para construir la URL completa de la imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/MONITOR_images/default.jpg';
    
    // Si la URL ya es completa (comienza con http o https), extraemos solo el nombre del archivo
    if (imagePath.startsWith('http')) {
      const parts = imagePath.split("\\");
      return `/images/${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
    }
    // Para otras rutas, también extraemos solo el nombre del archivo
    const fileName = imagePath.split('\\');
    return `/images/${fileName[fileName.length - 2]}/${fileName[fileName.length - 1]}`;
  };

  useEffect(() => {
    const handlePcType = () => {
      if (!boards?.length > 0) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          // Gaming - seleccionamos componentes de alto rendimiento
          selectedIndex = 0; // Asumimos que el primer componente es el de más alto rendimiento
          break;
        case 'workstation':
          // Workstation - balance entre rendimiento y estabilidad
          selectedIndex = Math.min(1, boards.length - 1); // Segundo componente o el último si solo hay uno
          break;
        case 'streaming':
          // Streaming - enfoque en CPU y RAM
          selectedIndex = Math.min(2, boards.length - 1); // Tercer componente o el último disponible
          break;
        case 'basic':
          // Configuración básica - componentes más económicos
          selectedIndex = boards.length - 1; // Último componente (asumiendo que está ordenado por precio)
          break;
        default:
          return; // Si no hay tipo específico, no hacemos selección automática
      }

      // Seleccionamos la placa base según el tipo
      setSelectedBoard(boards[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        motherboard: boards[selectedIndex].id_componente
      }));
      setCurrentStep(2); // Avanzamos al siguiente paso para activar la carga de CPUs
    };

    handlePcType();
  }, [type, boards]);

  // Efecto para CPU después de seleccionar placa base
  useEffect(() => {
    const handleCpuSelection = () => {
      if (!cpus?.length > 0 || !selectedBoard) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // CPU más potente para gaming
          break;
        case 'workstation':
          selectedIndex = Math.min(1, cpus.length - 1); // CPU balanceado
          break;
        case 'streaming':
          selectedIndex = 0; // CPU potente para streaming
          break;
        case 'basic':
          selectedIndex = cpus.length - 1; // CPU más económico
          break;
        default:
          return;
      }

      setSelectedCPU(cpus[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        procesador: cpus[selectedIndex].id_componente
      }));
      setCurrentStep(3);
    };

    handleCpuSelection();
  }, [type, selectedBoard, cpus]);

  // Efecto para GPU
  useEffect(() => {
    const handleGpuSelection = () => {
      if (!gpus?.length > 0 || !selectedCPU) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // GPU más potente para gaming
          break;
        case 'workstation':
          selectedIndex = Math.min(1, gpus.length - 1); // GPU balanceada
          break;
        case 'streaming':
          selectedIndex = Math.min(1, gpus.length - 1); // GPU media para streaming
          break;
        case 'basic':
          selectedIndex = gpus.length - 1; // GPU básica
          break;
        default:
          return;
      }

      setSelectedGPU(gpus[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        gpu: gpus[selectedIndex].id_componente
      }));
      setCurrentStep(4);
    };

    handleGpuSelection();
  }, [type, selectedCPU, gpus]);

  // Efecto para memoria
  useEffect(() => {
    const handleMemorySelection = () => {
      if (!memory?.length > 0 || !selectedGPU) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // Memoria más rápida para gaming
          break;
        case 'workstation':
          selectedIndex = 0; // Memoria de alta capacidad para workstation
          break;
        case 'streaming':
          selectedIndex = 0; // Memoria de alta capacidad para streaming
          break;
        case 'basic':
          selectedIndex = memory.length - 1; // Memoria básica
          break;
        default:
          return;
      }

      setSelectedMemory(memory[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        ram: memory[selectedIndex].id_componente
      }));
      setCurrentStep(5);
    };

    handleMemorySelection();
  }, [type, selectedGPU, memory]);

  // Efecto para almacenamiento
  useEffect(() => {
    const handleStorageSelection = () => {
      if (!disks?.length > 0 || !selectedMemory) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // SSD rápido para gaming
          break;
        case 'workstation':
          selectedIndex = 0; // Almacenamiento de alta capacidad
          break;
        case 'streaming':
          selectedIndex = 0; // Almacenamiento rápido para streaming
          break;
        case 'basic':
          selectedIndex = disks.length - 1; // Almacenamiento básico
          break;
        default:
          return;
      }

      setSelectedStorage(disks[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        almacenamiento: disks[selectedIndex].id_componente
      }));
      setCurrentStep(6);
    };

    handleStorageSelection();
  }, [type, selectedMemory, disks]);

  // Efecto para PSU
  useEffect(() => {
    const handlePsuSelection = () => {
      if (!psus?.length > 0 || !selectedStorage) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // PSU de alta potencia para gaming
          break;
        case 'workstation':
          selectedIndex = 0; // PSU de alta potencia para workstation
          break;
        case 'streaming':
          selectedIndex = Math.min(1, psus.length - 1); // PSU media para streaming
          break;
        case 'basic':
          selectedIndex = psus.length - 1; // PSU básica
          break;
        default:
          return;
      }

      setSelectedPSU(psus[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        fuente: psus[selectedIndex].id_componente
      }));
      setCurrentStep(7);
    };

    handlePsuSelection();
  }, [type, selectedStorage, psus]);

  // Efecto para Case
  useEffect(() => {
    const handleCaseSelection = () => {
      if (!cases?.length > 0 || !selectedPSU) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // Case gaming con mejor airflow
          break;
        case 'workstation':
          selectedIndex = Math.min(1, cases.length - 1); // Case espacioso para workstation
          break;
        case 'streaming':
          selectedIndex = Math.min(1, cases.length - 1); // Case medio para streaming
          break;
        case 'basic':
          selectedIndex = cases.length - 1; // Case básico
          break;
        default:
          return;
      }

      setSelectedCase(cases[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        gabinete: cases[selectedIndex].id_componente
      }));
      setCurrentStep(8);
    };

    handleCaseSelection();
  }, [type, selectedPSU, cases]);

  // Efecto final para Monitor
  useEffect(() => {
    const handleMonitorSelection = () => {
      if (!monitors?.length > 0 || !selectedCase) return;

      let selectedIndex = 0;
      
      switch(type) {
        case 'gaming':
          selectedIndex = 0; // Monitor gaming de alta frecuencia
          break;
        case 'workstation':
          selectedIndex = Math.min(1, monitors.length - 1); // Monitor de alta resolución
          break;
        case 'streaming':
          selectedIndex = Math.min(1, monitors.length - 1); // Monitor de buena calidad
          break;
        case 'basic':
          selectedIndex = monitors.length - 1; // Monitor básico
          break;
        default:
          return;
      }

      setSelectedMonitor(monitors[selectedIndex]);
      setFormData(prev => ({
        ...prev,
        monitor: monitors[selectedIndex].id_componente
      }));
      setCurrentStep(9);
    };

    handleMonitorSelection();
  }, [type, selectedCase, monitors]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Arma tu PC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sigue los pasos para configurar tu PC ideal
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            {steps.map((step) => (
              <div key={step.number} className="relative w-16 h-16 flex flex-col items-center">
                <div className={`w-10 min-h-10 rounded-full flex items-center justify-center border-2 
                  ${currentStep >= step.number 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-gray-300 bg-white text-gray-500 dark:bg-gray-800 dark:border-gray-600'}`}>
                  {step.number}
                </div>
                <div className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400">
                  {step.title}
                </div>
                {step.number !== 9 && (
                  <div className={`absolute top-5 left-[100%] h-[2px] 
                    ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1e293b] rounded-lg p-8 shadow-lg">
          {/* Mensaje de estado */}
          {((type && ['gaming', 'workstation', 'streaming', 'basic'].includes(type)) || currentStep === 9) && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              currentStep === 9 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              <p className="text-lg font-medium">
                {currentStep === 9 
                  ? '¡Tu PC se ha armado correctamente!' 
                  : 'Se está armando tu PC, espera un momento...'}
              </p>
            </div>
          )}

          <div className="flex justify-between my-8">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentStep === 1 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                disabled={currentStep === 1}
              >
                Anterior
              </button>
              
              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) || 
                        (currentStep === 2 && !selectedCPU) ||
                        (currentStep === 3 && !selectedGPU) ||
                        (currentStep === 4 && !selectedMemory) ||
                        (currentStep === 5 && !selectedStorage) ||
                        (currentStep === 6 && !selectedPSU) ||
                        (currentStep === 7 && !selectedCase) ||
                        (currentStep === 8 && !selectedMonitor)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${((currentStep === 1 && !selectedBoard) || 
                    (currentStep === 2 && !selectedCPU) ||
                    (currentStep === 3 && !selectedGPU) ||
                    (currentStep === 4 && !selectedMemory) ||
                    (currentStep === 5 && !selectedStorage) ||
                    (currentStep === 6 && !selectedPSU) ||
                    (currentStep === 7 && !selectedCase) ||
                    (currentStep === 8 && !selectedMonitor))
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {currentStep === 9 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          <div className="space-y-6">
            {/* Step content */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Placa Base
                </h2>
                {loadingBoards ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : boardsError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {boardsError}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {boards.map((board) => (
                      <div 
                        key={board.id_componente}
                        onClick={() => handleBoardSelect(board)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedBoard?.id_componente === board.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(board.imagenUrl)}
                              alt={board.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                              priority
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{board.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{board.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${board.precio}</p>
                            </div>
                            {selectedBoard?.id_componente === board.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Procesador
                </h2>
                {loadingCPUs ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : cpusError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {cpusError}
                  </div>
                ) : cpus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay procesadores compatibles con esta placa base
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {cpus.map((cpu) => (
                      <div 
                        key={cpu.id_componente}
                        onClick={() => handleCPUSelect(cpu)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedCPU?.id_componente === cpu.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(cpu.imagenUrl)}
                              alt={cpu.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{cpu.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{cpu.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${cpu.precio}</p>
                            </div>
                            {selectedCPU?.id_componente === cpu.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Tarjeta Gráfica
                </h2>
                {loadingGPUs ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : gpusError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {gpusError}
                  </div>
                ) : gpus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay tarjetas gráficas compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {gpus.map((gpu) => (
                      <div 
                        key={gpu.id_componente}
                        onClick={() => handleGPUSelect(gpu)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedGPU?.id_componente === gpu.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(gpu.imagenUrl)}
                              alt={gpu.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{gpu.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{gpu.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${gpu.precio}</p>
                            </div>
                            {selectedGPU?.id_componente === gpu.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Memoria RAM
                </h2>
                {loadingMemory ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : memoryError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {memoryError}
                  </div>
                ) : memory.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay memoria RAM compatible con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {memory.map((memoryItem) => (
                      <div 
                        key={memoryItem.id_componente}
                        onClick={() => handleMemorySelect(memoryItem)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedMemory?.id_componente === memoryItem.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(memoryItem.imagenUrl)}
                              alt={memoryItem.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{memoryItem.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{memoryItem.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${memoryItem.precio}</p>
                            </div>
                            {selectedMemory?.id_componente === memoryItem.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Disco Duro
                </h2>
                {loadingDisks ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : disksError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {disksError}
                  </div>
                ) : disks.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay discos duros compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {disks.map((disk) => (
                      <div 
                        key={disk.id_componente}
                        onClick={() => handleStorageSelect(disk)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedStorage?.id_componente === disk.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(disk.imagenUrl)}
                              alt={disk.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{disk.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{disk.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${disk.precio}</p>
                            </div>
                            {selectedStorage?.id_componente === disk.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Fuente de Poder
                </h2>
                {loadingPSUs ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : psusError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {psusError}
                  </div>
                ) : psus.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay fuentes de poder compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {psus.map((psu) => (
                      <div 
                        key={psu.id_componente}
                        onClick={() => handlePSUSelect(psu)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedPSU?.id_componente === psu.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(psu.imagenUrl)}
                              alt={psu.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{psu.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{psu.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${psu.precio}</p>
                            </div>
                            {selectedPSU?.id_componente === psu.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Gabinete
                </h2>
                {loadingCases ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : casesError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {casesError}
                  </div>
                ) : cases.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay gabinetes compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {cases.map((case_) => (
                      <div 
                        key={case_.id_componente}
                        onClick={() => handleCaseSelect(case_)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedCase?.id_componente === case_.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(case_.imagenUrl)}
                              alt={case_.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{case_.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{case_.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${case_.precio}</p>
                            </div>
                            {selectedCase?.id_componente === case_.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selecciona tu Monitor
                </h2>
                {loadingMonitors ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : monitorsError ? (
                  <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-md">
                    {monitorsError}
                  </div>
                ) : monitors.length === 0 ? (
                  <div className="text-yellow-500 text-center p-4 bg-yellow-100/10 rounded-md">
                    No hay monitores compatibles con tu configuración
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {monitors.map((monitor) => (
                      <div 
                        key={monitor.id_componente}
                        onClick={() => handleMonitorSelect(monitor)}
                        className={`p-4 rounded-lg transition-all cursor-pointer
                          ${selectedMonitor?.id_componente === monitor.id_componente
                            ? 'bg-blue-600 ring-2 ring-blue-400 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 relative">
                            <Image
                              src={getImageUrl(monitor.imagenUrl)}
                              alt={monitor.nombre}
                              width={128}
                              height={128}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{monitor.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{monitor.descripcion}</p>
                              </div>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">${monitor.precio}</p>
                            </div>
                            {selectedMonitor?.id_componente === monitor.id_componente && (
                              <div className="mt-2 text-white dark:text-blue-200 text-sm">
                                ✓ Seleccionado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de tu Configuración
                </h2>
                <div className="space-y-4">
                  {/* Motherboard */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Tarjeta Madre</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedBoard?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBoard?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedBoard?.descripcion || ''}
                    </p>
                  </div>

                  {/* CPU */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Procesador</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedCPU?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCPU?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedCPU?.descripcion || ''}
                    </p>
                  </div>

                  {/* GPU */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Tarjeta Gráfica</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedGPU?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedGPU?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedGPU?.descripcion || ''}
                    </p>
                  </div>

                  {/* RAM */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Memoria RAM</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedMemory?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMemory?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedMemory?.descripcion || ''}
                    </p>
                  </div>

                  {/* Storage */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Almacenamiento</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedStorage?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStorage?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedStorage?.descripcion || ''}
                    </p>
                  </div>

                  {/* PSU */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Fuente de Poder</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedPSU?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPSU?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedPSU?.descripcion || ''}
                    </p>
                  </div>

                  {/* Case */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Gabinete</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedCase?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCase?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedCase?.descripcion || ''}
                    </p>
                  </div>

                  {/* Monitor */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">Monitor</h3>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ${selectedMonitor?.precio || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMonitor?.nombre || 'No seleccionado'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {selectedMonitor?.descripcion || ''}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Precio Total
                      </h3>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${(
                          (selectedBoard?.precio || 0) +
                          (selectedCPU?.precio || 0) +
                          (selectedGPU?.precio || 0) +
                          (selectedMemory?.precio || 0) +
                          (selectedStorage?.precio || 0) +
                          (selectedPSU?.precio || 0) +
                          (selectedCase?.precio || 0) +
                          (selectedMonitor?.precio || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentStep === 1 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                disabled={currentStep === 1}
              >
                Anterior
              </button>
              
              <button
                type={currentStep === 9 ? 'submit' : 'button'}
                onClick={currentStep === 9 ? handleSubmit : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) || 
                        (currentStep === 2 && !selectedCPU) ||
                        (currentStep === 3 && !selectedGPU) ||
                        (currentStep === 4 && !selectedMemory) ||
                        (currentStep === 5 && !selectedStorage) ||
                        (currentStep === 6 && !selectedPSU) ||
                        (currentStep === 7 && !selectedCase) ||
                        (currentStep === 8 && !selectedMonitor)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${((currentStep === 1 && !selectedBoard) || 
                    (currentStep === 2 && !selectedCPU) ||
                    (currentStep === 3 && !selectedGPU) ||
                    (currentStep === 4 && !selectedMemory) ||
                    (currentStep === 5 && !selectedStorage) ||
                    (currentStep === 6 && !selectedPSU) ||
                    (currentStep === 7 && !selectedCase) ||
                    (currentStep === 8 && !selectedMonitor))
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {currentStep === 9 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmarPcPage;