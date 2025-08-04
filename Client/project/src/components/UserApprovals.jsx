import React, { useState, useEffect } from 'react';
import { Check, X, User, Mail, Calendar, Clock } from 'lucide-react';

const UserApprovals = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching pending user requests...');
      
      const response = await fetch('http://localhost:3001/api/registration/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Pending requests loaded:', data);
        setPendingRequests(data);
      } else {
        setError('Failed to load pending requests');
      }
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      setError('Error loading pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId, requestedRole) => {
    try {
      console.log('🔄 Approving user:', { requestId, requestedRole });
      
      const response = await fetch(`http://localhost:3001/api/registration/approve/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ 
          assignedRole: requestedRole 
        })
      });

      if (response.ok) {
        alert('✅ User approved successfully!');
        fetchPendingRequests(); // Refresh list
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || 'Failed to approve user'}`);
      }
    } catch (error) {
      console.error('❌ Error approving user:', error);
      alert('❌ Error approving user');
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      console.log('🔄 Rejecting user:', { requestId, reason });
      
      const response = await fetch(`http://localhost:3001/api/registration/reject/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ 
          rejectionReason: reason 
        })
      });

      if (response.ok) {
        alert('❌ User request rejected');
        fetchPendingRequests(); // Refresh list
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || 'Failed to reject user'}`);
      }
    } catch (error) {
      console.error('❌ Error rejecting user:', error);
      alert('❌ Error rejecting user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Approvals</h1>
            <p className="text-gray-600">Manage pending user registration requests</p>
          </div>
          <button 
            onClick={fetchPendingRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">All user registration requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                📋 {pendingRequests.length} pending registration request{pendingRequests.length !== 1 ? 's' : ''}
              </p>
            </div>

            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <User className="w-6 h-6 text-gray-500 mr-3" />
                      <h3 className="font-bold text-xl text-gray-900">
                        {request.first_name} {request.last_name}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 mr-3" />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3" />
                        <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Role: {request.requested_role}
                      </span>
                    </div>

                    {request.reason && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700">
                          <strong>Reason:</strong> {request.reason}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleApprove(request.id, request.requested_role)}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center min-w-[120px]"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center min-w-[120px]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserApprovals;