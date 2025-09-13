import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, DownloadIcon, ImageIcon, XCircleIcon, LogoIcon } from './components/icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('Sua Marca d\'Água');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const fontSize = Math.max(16, Math.min(canvas.width / 18, canvas.height / 22));
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      
      const padding = fontSize * 0.75;
      const x = canvas.width / 2;
      const y = canvas.height - padding;
      
      // Shadow and Stroke for maximum readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.lineWidth = fontSize / 15;
      ctx.strokeText(watermarkText, x, y);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
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
    <div className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-slate-900">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
                <LogoIcon className="w-10 h-10 text-cyan-400" />
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Gerador de Marca d'Água</h1>
            </div>
            <p className="text-lg text-slate-400">Adicione uma marca d'água profissional às suas imagens instantaneamente.</p>
        </header>

        <main className="glass-panel rounded-2xl shadow-2xl shadow-black/30 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-white border-b-2 border-cyan-400/50 pb-2">1. Controle</h2>
            
            {!originalImage ? (
                <div 
                    onClick={triggerFileInput}
                    className="relative block w-full h-48 rounded-lg border-2 border-dashed border-slate-600 text-center hover:border-cyan-400 hover:bg-slate-800/20 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center group"
                >
                    <UploadIcon className="mx-auto h-12 w-12 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="mt-2 block text-sm font-medium text-slate-300">
                      Clique para carregar uma imagem
                    </span>
                    <input ref={fileInputRef} type="file" onChange={handleImageUpload} accept="image/*" className="sr-only"/>
                </div>
            ) : (
                <div className="relative group">
                    <img src={originalImage} alt="Original" className="w-full h-48 object-contain rounded-lg bg-black/20" />
                    <button onClick={clearImage} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none">
                        <XCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            )}

            <div>
              <label htmlFor="watermark-text" className="block text-sm font-medium text-slate-300 mb-1">
                Texto da Marca d'Água
              </label>
              <input
                type="text"
                id="watermark-text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Digite seu texto aqui"
                className="block w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm text-white"
              />
            </div>

            <button
              onClick={applyWatermark}
              disabled={!originalImage || status === 'loading'}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
            >
              {status === 'loading' ? 'Processando...' : "Aplicar Marca d'Água"}
            </button>
            
            {processedImage && (
                <a
                  href={processedImage}
                  download="imagem-com-marca-dagua.png"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-slate-900 bg-green-400 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-400 transition-all duration-300 transform active:scale-95"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Baixar Imagem
                </a>
            )}
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>

          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-white border-b-2 border-cyan-400/50 pb-2">2. Visualização</h2>
            <div className="w-full h-full min-h-[20rem] bg-black/20 rounded-lg flex items-center justify-center p-2">
              {processedImage ? (
                <img src={processedImage} alt="Imagem com marca d'água" className="max-w-full max-h-full object-contain rounded-md" />
              ) : (
                <div className="text-center text-slate-500">
                  <ImageIcon className="mx-auto h-16 w-16" />
                  <p className="mt-2">A imagem processada aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8">
            <p className="text-sm text-slate-500">
                Código fonte disponível no{' '}
                <a 
                    href="https://github.com/SOSTITUISCI-CON-IL-TUO-UTENTE/SOSTITUISCI-CON-IL-NOME-DEL-REPO" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-cyan-400 hover:underline"
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
