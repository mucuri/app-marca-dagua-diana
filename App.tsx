
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, DownloadIcon, ImageIcon, XCircleIcon } from './components/icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('Sua Marca d\'Água');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setProcessedImage(null);
        setStatus('idle');
        setError(null);
      };
      reader.onerror = () => {
        setError('Falha ao ler o arquivo de imagem.');
        setStatus('error');
      };
      reader.readAsDataURL(file);
    } else {
        setError('Por favor, selecione um arquivo de imagem válido.');
        setStatus('error');
    }
  };

  const applyWatermark = useCallback(() => {
    if (!originalImage) {
      setError('Por favor, carregue uma imagem primeiro.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);

    const image = new Image();
    image.src = originalImage;
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Não foi possível obter o contexto do canvas.');
        setStatus('error');
        return;
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.drawImage(image, 0, 0);

      // Style the watermark
      const fontSize = Math.max(12, Math.min(canvas.width / 20, canvas.height / 25));
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      
      const padding = fontSize * 0.75;
      const x = canvas.width / 2;
      const y = canvas.height - padding;

      // Add a subtle shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      
      ctx.fillText(watermarkText, x, y);

      setProcessedImage(canvas.toDataURL('image/png'));
      setStatus('success');
    };

    image.onerror = () => {
      setError('Falha ao carregar a imagem para processamento.');
      setStatus('error');
    };
  }, [originalImage, watermarkText]);

  const clearImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setStatus('idle');
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Gerador de Marca d'Água</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Adicione texto às suas imagens de forma rápida e fácil.</p>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b-2 border-indigo-500 dark:border-indigo-400 pb-2">1. Controle</h2>
            
            {!originalImage ? (
                <div 
                    onClick={triggerFileInput}
                    className="relative block w-full h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center"
                >
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                      Clique para carregar uma imagem
                    </span>
                    <input ref={fileInputRef} type="file" onChange={handleImageUpload} accept="image/*" className="sr-only"/>
                </div>
            ) : (
                <div className="relative group">
                    <img ref={originalImageRef} src={originalImage} alt="Original" className="w-full h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-700" />
                    <button onClick={clearImage} className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100">
                        <XCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            )}

            <div>
              <label htmlFor="watermark-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto da Marca d'Água
              </label>
              <input
                type="text"
                id="watermark-text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Digite seu texto aqui"
                className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <button
              onClick={applyWatermark}
              disabled={!originalImage || status === 'loading'}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300"
            >
              {status === 'loading' ? 'Processando...' : "Aplicar Marca d'Água"}
            </button>
            
            {processedImage && (
                <a
                  href={processedImage}
                  download="imagem-com-marca-dagua.png"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Baixar Imagem
                </a>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b-2 border-indigo-500 dark:border-indigo-400 pb-2">2. Visualização</h2>
            <div className="w-full h-full min-h-[20rem] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-4">
              {processedImage ? (
                <img src={processedImage} alt="Imagem com marca d'água" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <ImageIcon className="mx-auto h-16 w-16" />
                  <p className="mt-2">A imagem processada aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Código fonte disponível no{' '}
                <a 
                    href="https://github.com/SEU-NOME-DE-USUARIO/NOME-DEL-TUO-REPOSITORY" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    GitHub
                </a>.
            </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
