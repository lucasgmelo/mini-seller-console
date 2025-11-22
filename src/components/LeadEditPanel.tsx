import { useState, useCallback } from 'react';
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
    onSuccess: () => {
      onClose();
    },
    onError: error => {
      console.error('Failed to convert lead to opportunity:', error);
    },
  });

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      setFormData(prev => {
        const newData = { ...prev, email };
        setHasChanges(
          newData.email !== lead.email || newData.status !== lead.status
        );
        return newData;
      });

      if (email && !validateEmail(email)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address',
        }));
      } else {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    },
    [lead.email, lead.status]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const status = e.target.value as LeadStatus;
      setFormData(prev => {
        const newData = { ...prev, status };
        setHasChanges(
          newData.email !== lead.email || newData.status !== lead.status
        );
        return newData;
      });
    },
    [lead.email, lead.status]
  );

  const handleSave = useCallback(async () => {
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
  }, [formData.email, formData.status, lead.email, lead.status, onSave]);

  const handleConvertToOpportunity = useCallback(() => {
    convertMutation.mutate();
  }, [convertMutation]);

  const canConvertToOpportunity = lead.status === 'qualified';

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (hasChanges && !errors.email && !isLoading) {
          handleSave();
        }
      }
    },
    [hasChanges, errors.email, isLoading, handleSave]
  );

  return (
    <div className='space-y-6' onKeyDown={handleKeyDown}>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Name
          </label>
          <p className='text-sm text-gray-900 p-3 bg-surface-100 rounded-md'>
            {lead.name}
          </p>
          <p className='text-xs text-gray-500 mt-1'>Read-only</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Company
          </label>
          <p className='text-sm text-gray-900 p-3 bg-surface-100 rounded-md'>
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
          <p className='text-sm text-gray-900 p-3 bg-surface-100 rounded-md'>
            {lead.source}
          </p>
          <p className='text-xs text-gray-500 mt-1'>Read-only</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Score
          </label>
          <div className='flex items-center space-x-2 p-3 bg-surface-100 rounded-md'>
            <span
              className={`text-sm font-medium ${getScoreColor(lead.score)}`}
            >
              {formatScore(lead.score)}
            </span>
            <div className='flex-1 bg-surface-300 rounded-full h-2'>
              <div
                className={`h-2 rounded-full ${
                  lead.score >= 80
                    ? 'bg-accent-500'
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
        <div className='space-y-4 pt-6 border-t border-surface-300'>
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
            <div className='space-y-4 p-4 bg-primary-50 rounded-lg'>
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

      <div className='flex justify-between items-center pt-4 border-t border-surface-300'>
        {hasChanges && !errors.email && (
          <p className='text-xs text-amber-600 flex items-center'>
            <svg
              className='w-3 h-3 mr-1'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Unsaved changes
          </p>
        )}
        <div className='flex space-x-3 ml-auto'>
          <Button variant='secondary' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || !!errors.email || isLoading}
            loading={isLoading}
          >
            {hasChanges ? 'Save Changes' : 'No Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};
