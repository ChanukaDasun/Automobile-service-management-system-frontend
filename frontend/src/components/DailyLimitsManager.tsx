// src/components/DailyLimitsManager.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';

interface DailyServiceLimit {
  id: string;
  date: string;
  maxVehicles: number;
  notes?: string;
  currentBookings?: number;
}

export default function DailyLimitsManager() {
  const [limits, setLimits] = useState<DailyServiceLimit[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formDate, setFormDate] = useState('');
  const [formMaxVehicles, setFormMaxVehicles] = useState('');
  const [formNotes, setFormNotes] = useState('');
  
  // Edit state
  const [editMaxVehicles, setEditMaxVehicles] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    fetchDailyLimits();
  }, []);

  const fetchDailyLimits = async () => {
    try {
      setLoading(true);
      // UPDATED: Connect to actual backend API
      const response = await fetch('http://localhost:9000/api/admin/daily-limits');
      if (response.ok) {
        const data = await response.json();
        setLimits(data);
      } else {
        console.error('Failed to fetch daily limits:', response.status);
      }
    } catch (error) {
      console.error('Error fetching daily limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLimit = async () => {
    if (!formDate || !formMaxVehicles) {
      alert('Please fill in date and max vehicles');
      return;
    }

    const maxVehicles = parseInt(formMaxVehicles);
    if (maxVehicles <= 0) {
      alert('Max vehicles must be greater than 0');
      return;
    }

    try {
      // UPDATED: Connect to actual backend API
      const response = await fetch('http://localhost:9000/api/admin/daily-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formDate,
          maxVehicles,
          notes: formNotes || undefined,
        }),
      });

      if (response.ok) {
        await fetchDailyLimits();
        setFormDate('');
        setFormMaxVehicles('');
        setFormNotes('');
        setShowAddForm(false);
      } else {
        const error = await response.json();
        alert(`Failed to add daily limit: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding daily limit:', error);
      alert('Failed to add daily limit');
    }
  };

  const handleStartEdit = (limit: DailyServiceLimit) => {
    setEditingId(limit.id);
    setEditMaxVehicles(limit.maxVehicles.toString());
    setEditNotes(limit.notes || '');
  };

  const handleSaveEdit = async (id: string) => {
    const maxVehicles = parseInt(editMaxVehicles);
    if (maxVehicles <= 0) {
      alert('Max vehicles must be greater than 0');
      return;
    }

    try {
      // UPDATED: Connect to actual backend API
      const response = await fetch(`http://localhost:9000/api/admin/daily-limits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxVehicles,
          notes: editNotes || undefined,
        }),
      });

      if (response.ok) {
        await fetchDailyLimits();
        setEditingId(null);
      } else {
        const error = await response.json();
        alert(`Failed to update daily limit: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating daily limit:', error);
      alert('Failed to update daily limit');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditMaxVehicles('');
    setEditNotes('');
  };

  const handleDeleteLimit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this daily limit?')) {
      return;
    }

    try {
      // UPDATED: Connect to actual backend API
      const response = await fetch(`http://localhost:9000/api/admin/daily-limits/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchDailyLimits();
      } else {
        const error = await response.json();
        alert(`Failed to delete daily limit: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting daily limit:', error);
      alert('Failed to delete daily limit');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getStatusColor = (limit: DailyServiceLimit) => {
    if (!limit.currentBookings) return 'border-slate-200 bg-white';
    const percentage = (limit.currentBookings / limit.maxVehicles) * 100;
    if (percentage >= 100) return 'border-red-200 bg-red-50';
    if (percentage >= 80) return 'border-orange-200 bg-orange-50';
    if (percentage >= 50) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Daily Vehicle Limits
            </CardTitle>
            <CardDescription>
              Set maximum number of vehicles for specific dates
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Limit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-semibold text-slate-900 mb-3">Add New Daily Limit</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="limit-date">Date</Label>
                <Input
                  id="limit-date"
                  type="date"
                  min={getTodayDate()}
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-vehicles">Max Vehicles</Label>
                <Input
                  id="max-vehicles"
                  type="number"
                  min="1"
                  placeholder="e.g., 50"
                  value={formMaxVehicles}
                  onChange={(e) => setFormMaxVehicles(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="e.g., Holiday schedule"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={handleAddLimit} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Limit
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setFormDate('');
                  setFormMaxVehicles('');
                  setFormNotes('');
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Limits List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : limits.length > 0 ? (
          <div className="space-y-3">
            {limits
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((limit) => (
                <div
                  key={limit.id}
                  className={`p-3 border-2 rounded-lg ${getStatusColor(limit)}`}
                >
                  {editingId === limit.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Date</Label>
                          <Input
                            type="text"
                            value={new Date(limit.date).toLocaleDateString()}
                            disabled
                            className="bg-slate-100"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max Vehicles</Label>
                          <Input
                            type="number"
                            min="1"
                            value={editMaxVehicles}
                            onChange={(e) => setEditMaxVehicles(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Notes</Label>
                          <Input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Optional notes"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSaveEdit(limit.id)}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900">
                            {new Date(limit.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </h4>
                          {limit.notes && (
                            <span className="text-xs text-slate-600 italic">
                              {limit.notes}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Max: </span>
                            <span className="font-bold text-slate-900">
                              {limit.maxVehicles} vehicles
                            </span>
                          </div>
                          {limit.currentBookings !== undefined && (
                            <>
                              <div>
                                <span className="text-slate-600">Booked: </span>
                                <span className="font-bold">
                                  {limit.currentBookings}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600">Available: </span>
                                <span className="font-bold text-green-700">
                                  {limit.maxVehicles - limit.currentBookings}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStartEdit(limit)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteLimit(limit.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No daily limits set</p>
            <p className="text-slate-400 text-xs">Click "Add Limit" to set vehicle capacity</p>
          </div>
        )}

        {/* Info */}
        {!showAddForm && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-semibold mb-1">How it works:</p>
                <p>Set daily limits to control how many vehicles can be serviced on specific dates. Customers won't be able to book once the limit is reached.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
