import { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserApproval {
  user_id: string;
  email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export function UserApprovals({ userEmail }: { userEmail: string }) {
  const [approvals, setApprovals] = useState<UserApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-36ac7b49/admin/user-approvals`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch approvals');
      }

      const data = await response.json();
      setApprovals(data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast.error('Failed to load user approvals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApproval = async (userId: string, action: 'approve' | 'reject') => {
    try {
      setProcessingUserId(userId);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-36ac7b49/admin/user-approval/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            action,
            admin_email: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      const data = await response.json();
      toast.success(data.message);
      
      // Refresh the list
      await fetchApprovals();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setProcessingUserId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Approvals</h2>
          <p className="text-sm text-gray-600">Manage user access to the warehouse system</p>
        </div>
        <Button
          onClick={fetchApprovals}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardDescription>Pending Approval</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-green-600">{approvedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">{rejectedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>All User Requests</CardTitle>
          <CardDescription>
            Review and manage user access requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No user approval requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.map((approval) => (
                <div
                  key={approval.user_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{approval.name}</h3>
                      {getStatusBadge(approval.status)}
                    </div>
                    <p className="text-sm text-gray-600">{approval.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {formatDate(approval.requested_at)}
                    </p>
                    {approval.approved_at && (
                      <p className="text-xs text-gray-500">
                        {approval.status === 'approved' ? 'Approved' : 'Rejected'} by {approval.approved_by} on {formatDate(approval.approved_at)}
                      </p>
                    )}
                  </div>

                  {approval.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApproval(approval.user_id, 'approve')}
                        disabled={processingUserId === approval.user_id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processingUserId === approval.user_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleApproval(approval.user_id, 'reject')}
                        disabled={processingUserId === approval.user_id}
                        size="sm"
                        variant="destructive"
                      >
                        {processingUserId === approval.user_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
