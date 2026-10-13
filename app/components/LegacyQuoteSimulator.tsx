'use client';

import { useState } from 'react';

type Step = 1 | 2 | 3 | 4 | 5;

type FormData = {
  turfType: string;
  areaSqMeters: number;
  needsPreparation: string;
  name: string;
  phone: string;
};

export default function QuoteSimulator() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    turfType: '',
    areaSqMeters: 50,
    needsPreparation: '',
    name: '',
    phone: '',
  });

  const updateForm = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const calculateEstimate = () => {
    // Basic estimation logic just to show *something* (e.g., in USD or COP).
    // Usually, this would be computed on the server to hide pricing rules, but for MVP it's fine here.
    let basePricePerSqM = 0;
    if (formData.turfType === 'Deportiva Certificada (Pádel/Fútbol)') basePricePerSqM = 45000;
    if (formData.turfType === 'Paisajismo Premium (Residencial)') basePricePerSqM = 35000;
    if (formData.turfType === 'Económica / Decorativa') basePricePerSqM = 25000;

    let prepCost = 0;
    if (formData.needsPreparation === 'Sí, terreno de tierra/pasto') prepCost = 15000;
    if (formData.needsPreparation === 'No estoy seguro') prepCost = 10000;

    const totalEstimatedCOP = (basePricePerSqM + prepCost) * formData.areaSqMeters;
    
    // Format to COP
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalEstimatedCOP);
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5) as Step);
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      source: "BOUTIQUE", // Adjust logic if needed or send specific site origin
      fullName: formData.name,
      phone: formData.phone,
      requestedType: "CORPORATIVO",
      description: `COTIZADOR ONLINE: \n- Tipo de Grama: ${formData.turfType} \n- Área: ${formData.areaSqMeters} m² \n- Preparación: ${formData.needsPreparation}`,
    };

    const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL || "http://localhost:3000";

    try {
      await fetch(`${crmUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Move to success/results screen
      setStep(5);
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Hubo un error al procesar la solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="simulador" className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-brand-dark p-6 text-center">
        <h2 className="text-2xl font-black text-white">Simulador de Inversión</h2>
        <p className="text-gray-300 text-sm mt-1">Cotiza tu proyecto de grama sintética en 30 segundos.</p>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between max-w-xs mx-auto mt-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-brand-green text-white' : 'bg-gray-600 text-gray-400'}`}>
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 md:p-12">
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-brand-dark mb-6">1. ¿Qué tipo de grama estás buscando?</h3>
            <div className="grid grid-cols-1 gap-4">
              {['Deportiva Certificada (Pádel/Fútbol)', 'Paisajismo Premium (Residencial)', 'Económica / Decorativa'].map((type) => (
                <button
                  key={type}
                  onClick={() => { updateForm('turfType', type); handleNext(); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${formData.turfType === type ? 'border-brand-green bg-green-50' : 'border-gray-200 hover:border-brand-green/50'}`}
                >
                  <span className="font-bold text-brand-dark block">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-brand-dark mb-6">2. ¿De qué tamaño es el área a intervenir?</h3>
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 font-medium">Área estimada</span>
                <span className="text-4xl font-black text-brand-green">{formData.areaSqMeters} m²</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={formData.areaSqMeters}
                onChange={(e) => updateForm('areaSqMeters', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>10 m²</span>
                <span>1,000+ m²</span>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={handleBack} className="text-gray-500 font-medium px-4 py-2 hover:text-brand-dark transition-colors">Atrás</button>
              <button onClick={handleNext} className="bg-brand-dark text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors shadow-lg">Continuar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-brand-dark mb-6">3. ¿El terreno requiere preparación base?</h3>
            <p className="text-sm text-gray-500 mb-6">La grama necesita instalarse sobre una superficie dura (placa) o compactada (recebo).</p>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {['No, ya es placa/concreto', 'Sí, terreno de tierra/pasto', 'No estoy seguro'].map((prep) => (
                <button
                  key={prep}
                  onClick={() => { updateForm('needsPreparation', prep); handleNext(); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${formData.needsPreparation === prep ? 'border-brand-green bg-green-50' : 'border-gray-200 hover:border-brand-green/50'}`}
                >
                  <span className="font-bold text-brand-dark block">{prep}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-start">
              <button onClick={handleBack} className="text-gray-500 font-medium px-4 py-2 hover:text-brand-dark transition-colors">Atrás</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-brand-dark mb-2">4. ¡Cálculo listo!</h3>
            <p className="text-gray-500 mb-6">Déjanos tus datos para revelarte el costo estimado de inmediato.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                  placeholder="Ej. Carlos Mendoza"
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp / Teléfono</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                  placeholder="Ej. 300 123 4567"
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <button type="button" onClick={handleBack} className="text-gray-500 font-medium px-4 py-2 hover:text-brand-dark transition-colors">Atrás</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-brand-gold text-brand-dark px-8 py-4 rounded-lg font-black text-lg hover:bg-yellow-400 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Calculando...' : 'Ver Estimado Ahora'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-brand-green">✓</span>
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-2">¡Solicitud Procesada!</h3>
            <p className="text-gray-500 mb-8">El costo estimado base para tu proyecto ({formData.areaSqMeters}m²) es de aproximadamente:</p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <span className="text-4xl md:text-5xl font-black text-brand-green tracking-tight">{calculateEstimate()}</span>
              <p className="text-xs text-gray-400 mt-3">*Este valor es una estimación sujeta a visita técnica y puede variar.</p>
            </div>

            <p className="text-gray-600">Un ingeniero de Proyectos y Montajes se pondrá en contacto contigo en breve para agendar la visita técnica y ajustar el presupuesto a la medida.</p>
          </div>
        )}
      </div>
    </div>
  );
}
