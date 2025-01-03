import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

type TrendingContextType = {
  topics: string[];
  setTopics: (topics: string[]) => void;
  refreshTopics: () => void;
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;
};

const TrendingContext = createContext<TrendingContextType | undefined>(undefined);

const TrendingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<string[]>([]);

  const fetchTrendingTopics = async (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['React', 'TypeScript', 'Web Development', 'AI', 'OpenAI']);
      }, 1000);
    });
  };

  const refreshTopics = async () => {
    const newTopics = await fetchTrendingTopics();
    setTopics(newTopics);
  };

  const addTopic = (topic: string) => {
    setTopics((prevTopics) => [...prevTopics, topic]);
  };

  const removeTopic = (topic: string) => {
    setTopics((prevTopics) => prevTopics.filter((t) => t !== topic));
  };

  useEffect(() => {
    refreshTopics();
  }, [refreshTopics]);  // Add refreshTopics to the dependency array

  return (
    <TrendingContext.Provider value={{ topics, setTopics, refreshTopics, addTopic, removeTopic }}>
      {children}
    </TrendingContext.Provider>
  );
};

const useTrending = (): TrendingContextType => {
  const context = useContext(TrendingContext);
  if (!context) {
    throw new Error('useTrending must be used within a TrendingProvider');
  }
  return context;
};

export { useTrending };
export default TrendingProvider;
