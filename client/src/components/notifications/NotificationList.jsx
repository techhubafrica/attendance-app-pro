import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash, Bell, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deleteNotification, getUserNotifications, markNotificationAsRead } from '@/redux/actions/notificationActions';

const NotificationList = ({ userId }) => {
  const dispatch = useDispatch();
  const { notifications, loading, totalPages, currentPage } = useSelector((state) => state.notifications);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId, filter, currentPage]);

  const loadNotifications = () => {
    const params = { page: currentPage, limit: 10 };
    if (filter === 'unread') {
      params.read = false;
    } else if (filter === 'read') {
      params.read = true;
    }
    dispatch(getUserNotifications(userId, params));
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(getUserNotifications(userId, { page: newPage, limit: 10 }));
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="space-y-4 mt-40">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'unread' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('unread')}
          >
            Unread
          </Button>
          <Button 
            variant={filter === 'read' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('read')}
          >
            Read
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification._id} className={notification.read ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {!notification.read && (
                      <Badge variant="default" className="bg-primary h-2 w-2 rounded-full p-0" />
                    )}
                    {notification.title}
                  </CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                {!notification.read && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleMarkAsRead(notification._id)}
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDelete(notification._id)}
                  title="Delete notification"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages).keys()].map((page) => (
                  <Button
                    key={page + 1}
                    variant={currentPage === page + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={loading}
                  >
                    {page + 1}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="text-center py-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2">
              <Bell className="h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No notifications found</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationList;