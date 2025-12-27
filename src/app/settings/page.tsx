'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Plus, Trash2, Edit, Copy, Check, Globe, Key, Link2, Server, AlertCircle, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface CPANetwork {
  id: string
  name: string
  displayName: string
  apiKey: string
  apiSecret?: string
  postbackUrl: string
  status: string
  createdAt: string
  updatedAt: string
  offers?: NetworkOffer[]
}

interface NetworkOffer {
  id: string
  networkId: string
  externalId: string
  name: string
  payout: number
  status: string
}

const NETWORKS = [
  {
    value: 'clickdealer',
    label: 'ClickDealer',
    description: 'International affiliate network with global offers',
    docsUrl: 'https://docs.clickdealer.com',
    postbackFormat: 'payout={revenue}&external_id={offer_id}&subid={subid}&status={status}',
  },
  {
    value: 'trafee',
    label: 'Trafee',
    description: 'Premium mobile and desktop CPA offers',
    docsUrl: 'https://trafee.com/docs',
    postbackFormat: 'payout={revenue}&offer_id={external_id}&subid={subid}',
  },
  {
    value: 'adverten',
    label: 'Adverten',
    description: 'Smartlink and direct offers network',
    docsUrl: 'https://adverten.com/docs',
    postbackFormat: 'payout={revenue}&external_id={offer_id}&subid={subid}&status=approved',
  },
]

export default function SettingsPage() {
  const [networks, setNetworks] = useState<CPANetwork[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNetwork, setEditingNetwork] = useState<CPANetwork | null>(null)
  const [selectedNetworkType, setSelectedNetworkType] = useState('')
  const [formData, setFormData] = useState({
    displayName: '',
    apiKey: '',
    apiSecret: '',
    postbackUrl: '',
  })
  const [copiedPostback, setCopiedPostback] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchNetworks()
  }, [])

  const fetchNetworks = async () => {
    try {
      const response = await fetch('/api/networks')
      const data = await response.json()
      setNetworks(data)
    } catch (error) {
      console.error('Error fetching networks:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch networks',
      })
    }
  }

  const handleAddNetwork = async () => {
    try {
      const networkConfig = NETWORKS.find(n => n.value === selectedNetworkType)
      const response = await fetch('/api/networks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedNetworkType,
          displayName: formData.displayName || networkConfig?.label,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          postbackUrl: formData.postbackUrl,
        }),
      })

      if (!response.ok) throw new Error('Failed to create network')

      toast({
        title: 'Success',
        description: 'Network added successfully',
      })

      setIsAddDialogOpen(false)
      resetForm()
      fetchNetworks()
    } catch (error) {
      console.error('Error adding network:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add network',
      })
    }
  }

  const handleUpdateNetwork = async () => {
    if (!editingNetwork) return

    try {
      const response = await fetch(`/api/networks/${editingNetwork.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingNetwork,
        }),
      })

      if (!response.ok) throw new Error('Failed to update network')

      toast({
        title: 'Success',
        description: 'Network updated successfully',
      })

      setEditingNetwork(null)
      fetchNetworks()
    } catch (error) {
      console.error('Error updating network:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update network',
      })
    }
  }

  const handleDeleteNetwork = async (id: string) => {
    if (!confirm('Are you sure you want to delete this network?')) return

    try {
      const response = await fetch(`/api/networks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete network')

      toast({
        title: 'Success',
        description: 'Network deleted successfully',
      })

      fetchNetworks()
    } catch (error) {
      console.error('Error deleting network:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete network',
      })
    }
  }

  const getPostbackUrl = (network: CPANetwork) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    return `${baseUrl}/api/postback?network=${network.name}&api_key=${network.apiKey}&external_id={offer_id}&subid={subid}&revenue={revenue}&country={country}&status={status}`
  }

  const copyToClipboard = (text: string, networkId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPostback(networkId)
    setTimeout(() => setCopiedPostback(null), 2000)
    toast({
      title: 'Copied!',
      description: 'Postback URL copied to clipboard',
    })
  }

  const resetForm = () => {
    setFormData({
      displayName: '',
      apiKey: '',
      apiSecret: '',
      postbackUrl: '',
    })
    setSelectedNetworkType('')
  }

  const getNetworkConfig = (name: string) => NETWORKS.find(n => n.value === name)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Network Settings
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Configure CPA networks & postbacks</p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Network
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="networks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="networks">Networks</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          {/* Networks Tab */}
          <TabsContent value="networks" className="space-y-6">
            {networks.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Globe className="h-16 w-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Networks Configured</h3>
                  <p className="text-slate-500 text-center mb-4 max-w-md">
                    Add your CPA network credentials to start tracking conversions automatically
                  </p>
                  <Button
                    onClick={() => {
                      resetForm()
                      setIsAddDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Network
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {networks.map((network) => {
                  const config = getNetworkConfig(network.name)
                  const postbackUrl = getPostbackUrl(network)

                  return (
                    <Card key={network.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <Server className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{network.displayName || config?.label || network.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                {config?.description}
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={network.status === 'active' ? 'default' : 'secondary'}>
                                  {network.status}
                                </Badge>
                                <Badge variant="outline">
                                  {network.offers?.length || 0} Offers
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingNetwork(network)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteNetwork(network.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Postback URL Section */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2">
                              <Link2 className="h-4 w-4" />
                              Postback URL
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(postbackUrl, network.id)}
                            >
                              {copiedPostback === network.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Textarea
                            value={postbackUrl}
                            readOnly
                            className="font-mono text-xs bg-white dark:bg-slate-950"
                            rows={2}
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            Copy this URL and paste it into your {config?.label} network's postback settings
                          </p>
                        </div>

                        {/* API Credentials */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <Key className="h-4 w-4" />
                              API Key
                            </Label>
                            <Input
                              value={network.apiKey}
                              readOnly
                              type="password"
                              className="font-mono text-xs"
                            />
                          </div>
                          {network.apiSecret && (
                            <div>
                              <Label className="flex items-center gap-2 mb-2">
                                <Key className="h-4 w-4" />
                                API Secret
                              </Label>
                              <Input
                                value={network.apiSecret}
                                readOnly
                                type="password"
                                className="font-mono text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {NETWORKS.map((network) => (
                <Card key={network.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      {network.label}
                    </CardTitle>
                    <CardDescription>{network.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Postback Parameters</Label>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mt-2">
                        <code className="text-xs font-mono">
                          {network.postbackFormat}
                        </code>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Required Fields</Label>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                        <li>• <code className="font-mono">external_id</code> - Offer ID from network</li>
                        <li>• <code className="font-mono">revenue</code> - Payout amount</li>
                        <li>• <code className="font-mono">subid</code> - Sub ID tracking</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={network.docsUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        View Documentation
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* General Postback Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  How Postback Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Configure Postback in Network</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Copy the postback URL from your network configuration and paste it into your CPA network's postback settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Network Sends Conversion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    When a user completes an offer, the CPA network automatically sends a request to your postback URL with conversion details.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Dashboard Updates Automatically</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our system processes the postback, creates a lead record, and updates your dashboard in real-time.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Security Tips</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Keep your API key secret and never share it publicly</li>
                    <li>• Use HTTPS for postback URLs in production</li>
                    <li>• Monitor your postback logs regularly</li>
                    <li>• Validate postback parameters to prevent fraud</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Network Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add CPA Network</DialogTitle>
            <DialogDescription>
              Connect your CPA network to automatically track conversions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Network Type</Label>
              <Select value={selectedNetworkType} onValueChange={setSelectedNetworkType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedNetworkType && (
              <>
                <div>
                  <Label>Display Name (Optional)</Label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="My ClickDealer Account"
                  />
                </div>
                <div>
                  <Label>API Key *</Label>
                  <Input
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    type="password"
                  />
                </div>
                <div>
                  <Label>API Secret (Optional)</Label>
                  <Input
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    placeholder="Enter your API secret"
                    type="password"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddNetwork}
              disabled={!selectedNetworkType || !formData.apiKey}
            >
              Add Network
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Network Dialog */}
      <Dialog open={!!editingNetwork} onOpenChange={() => setEditingNetwork(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Network Configuration</DialogTitle>
            <DialogDescription>
              Update your CPA network settings
            </DialogDescription>
          </DialogHeader>
          {editingNetwork && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={editingNetwork.displayName || ''}
                  onChange={(e) => setEditingNetwork({ ...editingNetwork, displayName: e.target.value })}
                />
              </div>
              <div>
                <Label>API Key</Label>
                <Input
                  value={editingNetwork.apiKey}
                  onChange={(e) => setEditingNetwork({ ...editingNetwork, apiKey: e.target.value })}
                  type="password"
                />
              </div>
              <div>
                <Label>API Secret</Label>
                <Input
                  value={editingNetwork.apiSecret || ''}
                  onChange={(e) => setEditingNetwork({ ...editingNetwork, apiSecret: e.target.value })}
                  type="password"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editingNetwork.status}
                  onValueChange={(value) => setEditingNetwork({ ...editingNetwork, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNetwork(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNetwork}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
