import Joyride, { Step } from 'react-joyride';
import { useState, useEffect } from 'react';

const TOUR_KEY = 'onboarding-tour-completed';

const steps: Step[] = [
  {
    target: 'body',
    content: 'Bem-vindo ao Op.Intel! Vamos fazer um tour rápido de 30 segundos pelas funcionalidades principais.',
    placement: 'center',
  },
  {
    target: '[href="/scan"]',
    content: 'Use o Scanner para ler QR Codes dos equipamentos e acessar rapidamente suas informações.',
  },
  {
    target: '[href="/quick-event"]',
    content: 'Registre eventos rapidamente: Uso, Limpeza, Manutenção, Problema Grave ou Sugestão de Melhoria.',
  },
  {
    target: '[href="/audit-log"]',
    content: 'Visualize o histórico completo de todos os eventos registrados no sistema.',
  },
  {
    target: '[href="/reports"]',
    content: 'Gere relatórios em PDF com resumo mensal, KPIs e alertas de equipamentos negligenciados.',
  },
];

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_KEY);
    if (!hasSeenTour) {
      // Delay para garantir que o DOM está pronto
      setTimeout(() => setRun(true), 1000);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(TOUR_KEY, 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#10b981',
          zIndex: 10000,
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
    />
  );
}
