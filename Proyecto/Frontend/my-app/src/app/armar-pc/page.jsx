"use client";
import React, { useState, useEffect } from 'react';
import { useBoards } from '@/hooks/useBoards';
import { useCompatibleCPUs } from '@/hooks/useCompatibleCPUs';
import { useCompatibleGPUs } from '@/hooks/useCompatibleGPUs';

const ArmarPcPage = () => {
  const { boards, loading: loadingBoards, error: boardsError } = useBoards();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [formData, setFormData] = useState({
    procesador: '',
    motherboard: '',
    ram: '',
    almacenamiento: '',
    gpu: '',
    fuente: '',
    gabinete: '',
    refrigeracion: '',
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

  const steps = [
    { number: 1, title: "Procesador" },
    { number: 2, title: "Componentes" },
    { number: 3, title: "Almacenamiento" },
    { number: 4, title: "Extras" },
    { number: 5, title: "Resumen" }
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

  const handleNext = () => {
    if (currentStep < 5) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
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
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.number} className="relative w-16 h-16 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${currentStep >= step.number 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-gray-300 bg-white text-gray-500 dark:bg-gray-800 dark:border-gray-600'}`}>
                  {step.number}
                </div>
                <div className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-400">
                  {step.title}
                </div>
                {step.number !== 5 && (
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
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Componentes Adicionales
                </h2>
                {/* Add extra components fields here */}
              </div>
            )}
            
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de tu Configuración
                </h2>
                {/* Add summary content here */}
              </div>
            )}

            {/* Navigation Buttons */}
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
                type={currentStep === 5 ? 'submit' : 'button'}
                onClick={currentStep === 5 ? undefined : handleNext}
                disabled={(currentStep === 1 && !selectedBoard) || 
                         (currentStep === 2 && !selectedCPU) ||
                         (currentStep === 3 && !selectedGPU)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
                  ${((currentStep === 1 && !selectedBoard) || 
                     (currentStep === 2 && !selectedCPU) ||
                     (currentStep === 3 && !selectedGPU))
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {currentStep === 5 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmarPcPage;