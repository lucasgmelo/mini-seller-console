import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import type { Lead, LeadStatus, OpportunityStage } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { validateEmail } from '../utils/dataUtils';
import {
  getStatusColor,
  getStatusLabel,
  formatScore,
  getScoreColor,
} from '../utils/statusUtils';
import { useOpportunities } from '../hooks/useOpportunities';

interface LeadEditPanelProps {
  lead: Lead;
  onSave: (updates: Partial<Lead>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
];

const opportunityStageOptions = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
];

export const LeadEditPanel = ({
  lead,
  onSave,
  onClose,
  isLoading = false,
}: LeadEditPanelProps) => {
  const { createOpportunity } = useOpportunities();
  const [formData, setFormData] = useState({
    email: lead.email,
    status: lead.status,
  });
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [convertData, setConvertData] = useState({
    stage: 'prospecting' as OpportunityStage,
    amount: '',
  });

  const convertMutation = useMutation({
    mutationFn: async () => {
      const amount = convertData.amount
        ? parseFloat(convertData.amount)
        : undefined;
      return createOpportunity(lead, {
        stage: convertData.stage,
        amount,
      });
    },
    onError: error => {
      console.error('Failed to convert lead to opportunity:', error);
    },
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    setHasChanges(email !== lead.email || formData.status !== lead.status);

    if (email && !validateEmail(email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
    } else {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as LeadStatus;
    setFormData(prev => ({ ...prev, status }));
    setHasChanges(formData.email !== lead.email || status !== lead.status);
  };

  const handleSave = async () => {
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    const updates: Partial<Lead> = {};
    if (formData.email !== lead.email) updates.email = formData.email;
    if (formData.status !== lead.status) updates.status = formData.status;

    if (Object.keys(updates).length > 0) {
      await onSave(updates);
      setHasChanges(false);
    }
  };

  const handleConvertToOpportunity = () => {
    convertMutation.mutate();
  };

  const canConvertToOpportunity = lead.status === 'qualified';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasChanges && !errors.email && !isLoading) {
        handleSave();
      }
    }
  };

  return (
    <div className='space-y-6' onKeyDown={handleKeyDown}>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Name
          </label>
          <p className='text-sm text-gray-900 p-3 bg-gray-50 rounded-md'>
            {lead.name}
          </p>
          <p className='text-xs text-gray-500 mt-1'>Read-only</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Company
          </label>
          <p className='text-sm text-gray-900 p-3 bg-gray-50 rounded-md'>
            {lead.company}
          </p>
          <p className='text-xs text-gray-500 mt-1'>Read-only</p>
        </div>

        <Input
          label='Email'
          type='email'
          value={formData.email}
          onChange={handleEmailChange}
          error={errors.email}
          disabled={isLoading}
        />

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Source
          </label>
          <p className='text-sm text-gray-900 p-3 bg-gray-50 rounded-md'>
            {lead.source}
          </p>
          <p className='text-xs text-gray-500 mt-1'>Read-only</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Score
          </label>
          <div className='flex items-center space-x-2 p-3 bg-gray-50 rounded-md'>
            <span
              className={`text-sm font-medium ${getScoreColor(lead.score)}`}
            >
              {formatScore(lead.score)}
            </span>
            <div className='flex-1 bg-gray-200 rounded-full h-2'>
              <div
                className={`h-2 rounded-full ${
                  lead.score >= 80
                    ? 'bg-green-500'
                    : lead.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${lead.score}%` }}
              ></div>
            </div>
          </div>
          <p className='text-xs text-gray-500 mt-1'>Read-only</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Current Status
          </label>
          <Badge variant={getStatusColor(lead.status)} size='md'>
            {getStatusLabel(lead.status)}
          </Badge>
        </div>

        <Select
          label='Update Status'
          options={statusOptions}
          value={formData.status}
          onChange={handleStatusChange}
          disabled={isLoading}
        />
      </div>

      {canConvertToOpportunity && (
        <div className='space-y-4 pt-6 border-t border-gray-200'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium text-gray-900'>
              Convert to Opportunity
            </h3>
            {!showConvertForm && (
              <Button
                variant='secondary'
                size='sm'
                onClick={() => setShowConvertForm(true)}
                disabled={isLoading}
              >
                Convert Lead
              </Button>
            )}
          </div>

          {showConvertForm && (
            <div className='space-y-4 p-4 bg-blue-50 rounded-lg'>
              <Select
                label='Initial Stage'
                options={opportunityStageOptions}
                value={convertData.stage}
                onChange={e =>
                  setConvertData(prev => ({
                    ...prev,
                    stage: e.target.value as OpportunityStage,
                  }))
                }
                disabled={convertMutation.isPending}
              />

              <Input
                label='Amount (optional)'
                type='number'
                placeholder='Enter deal amount'
                value={convertData.amount}
                onChange={e =>
                  setConvertData(prev => ({ ...prev, amount: e.target.value }))
                }
                disabled={convertMutation.isPending}
              />

              <div className='flex justify-end space-x-3'>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => setShowConvertForm(false)}
                  disabled={convertMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size='sm'
                  onClick={handleConvertToOpportunity}
                  loading={convertMutation.isPending}
                  disabled={convertMutation.isPending}
                >
                  Create Opportunity
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
        <Button variant='secondary' onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || !!errors.email || isLoading}
          loading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
