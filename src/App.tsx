import { useState } from 'react';
import { Navbar, type TabId } from '@/components/Navbar';
import { AddressCalculationTab } from '@/tabs/AddressCalculationTab';
import { InsertionTab } from '@/tabs/InsertionTab';
import { DeletionTab } from '@/tabs/DeletionTab';
import { LinearSearchTab } from '@/tabs/LinearSearchTab';
import { BinarySearchTab } from '@/tabs/BinarySearchTab';
import { LearnTab } from '@/tabs/LearnTab';
import { Brackets, Info } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('address');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'learn' && (
          <section className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Brackets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">ArrayLab — Interactive Array Simulator</h1>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              An interactive educational tool for understanding array operations. Explore address calculation,
              insertion, deletion, linear search, and binary search with step-by-step visual simulations.
              Built for students learning Data Structures and Algorithms.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span>Admin: Srajan Gupta</span>
            </div>
          </section>
        )}

        {activeTab !== 'learn' && (
          <section className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Brackets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ArrayLab — Interactive Array Simulator</h1>
                <p className="text-slate-400 text-xs">Visualize and learn array operations step by step</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'address' && <AddressCalculationTab />}
        {activeTab === 'insertion' && <InsertionTab />}
        {activeTab === 'deletion' && <DeletionTab />}
        {activeTab === 'linear' && <LinearSearchTab />}
        {activeTab === 'binary' && <BinarySearchTab />}
        {activeTab === 'learn' && <LearnTab />}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>ArrayLab — Interactive Array Simulator · Built for DSA education</p>
        <p className="mt-1">Admin: Srajan Gupta</p>
      </footer>
    </div>
  );
}

export default App;
