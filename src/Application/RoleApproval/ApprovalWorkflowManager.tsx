import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ApprovalWorkflow, ApprovalWorkflowType, ApprovalWorkflowStage, ApproverTable, ApprovalCondition } from './types/ApprovalWorkflowManagerTypes';

const ApprovalWorkflowPage: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [selectedWorkflowType, setSelectedWorkflowType] = useState<ApprovalWorkflowType | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('workflows');

  // State for data
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [workflowTypes, setWorkflowTypes] = useState<ApprovalWorkflowType[]>([]);
  const [stages, setStages] = useState<ApprovalWorkflowStage[]>([]);
  const [approvers, setApprovers] = useState<ApproverTable[]>([]);
  const [conditions, setConditions] = useState<ApprovalCondition[]>([]);

  // Dialog states
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isApproverDialogOpen, setIsApproverDialogOpen] = useState(false);
  const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);

  const toggleStageExpansion = (stageId: number) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  // Add workflow
  const handleAddWorkflow = (workflow: Omit<ApprovalWorkflow, 'workflow_id' | 'created_at' | 'modified_at'>) => {
    const newWorkflow: ApprovalWorkflow = {
      ...workflow,
      workflow_id: Date.now(),
      created_at: new Date(),
      modified_at: new Date(),
    };
    setWorkflows([...workflows, newWorkflow]);
    setIsWorkflowDialogOpen(false);
  };

  // Delete workflow
  const handleDeleteWorkflow = (id: number) => {
    setWorkflows(workflows.filter(w => w.workflow_id !== id));
  };

  // Edit workflow
  const handleEditWorkflow = (id: number) => {
    const workflow = workflows?.find(w => w.workflow_id === id);
    if (workflow) {
      setSelectedWorkflow(workflow);
      setIsWorkflowDialogOpen(true);
    }
  };

  // Add workflow type
  const handleAddWorkflowType = (type: Omit<ApprovalWorkflowType, 'workflow_types_id' | 'created_at' | 'modified_at'>) => {
    const newType: ApprovalWorkflowType = {
      ...type,
      workflow_types_id: Date.now(),
      created_at: new Date(),
      modified_at: new Date(),
    };
    setWorkflowTypes([...workflowTypes, newType]);
    setIsTypeDialogOpen(false);
  };

  // Delete workflow type
  const handleDeleteWorkflowType = (id: number) => {
    setWorkflowTypes(workflowTypes.filter(t => t.workflow_types_id !== id));
  };

  // Add stage
  const handleAddStage = (stage: Omit<ApprovalWorkflowStage, 'stage_id' | 'created_at'>) => {
    const newStage: ApprovalWorkflowStage = {
      ...stage,
      stage_id: Date.now(),
      created_at: new Date(),
    };
    setStages([...stages, newStage]);
    setIsStageDialogOpen(false);
  };

  // Delete stage
  const handleDeleteStage = (id: number) => {
    setStages(stages.filter(s => s.stage_id !== id));
    setApprovers(approvers.filter(a => a.stage_id !== id));
  };

  // Add approver
  const handleAddApprover = (approver: Omit<ApproverTable, 'approver_id' | 'created_at'>) => {
    const newApprover: ApproverTable = {
      ...approver,
      approver_id: Date.now(),
      created_at: new Date(),
    };
    setApprovers([...approvers, newApprover]);
    setIsApproverDialogOpen(false);
  };

  // Delete approver
  const handleDeleteApprover = (id: number) => {
    setApprovers(approvers.filter(a => a.approver_id !== id));
  };

  // Add condition
  const handleAddCondition = (condition: Omit<ApprovalCondition, 'condition_id' | 'created_at'>) => {
    const newCondition: ApprovalCondition = {
      ...condition,
      condition_id: Date.now(),
      created_at: new Date(),
    };
    setConditions([...conditions, newCondition]);
    setIsConditionDialogOpen(false);
  };

  // Delete condition
  const handleDeleteCondition = (id: number) => {
    setConditions(conditions.filter(c => c.condition_id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a new approval workflow for your organization
                </DialogDescription>
              </DialogHeader>
              <WorkflowForm onSubmit={handleAddWorkflow} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="types">Workflow Types</TabsTrigger>
            <TabsTrigger value="stages">Stages</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
          </TabsList>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approval Workflows</CardTitle>
                <CardDescription>Manage your approval workflow configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowsTable 
                  workflows={workflows} 
                  onSelect={setSelectedWorkflow}
                  onDelete={handleDeleteWorkflow}
                  onEdit={handleEditWorkflow}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Types Tab */}
          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Types</CardTitle>
                <CardDescription>Define workflow types and their branches</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowTypesTable 
                  types={workflowTypes}
                  workflows={workflows}
                  onSelect={setSelectedWorkflowType}
                  onDelete={handleDeleteWorkflowType}
                  onAdd={handleAddWorkflowType}
                  isDialogOpen={isTypeDialogOpen}
                  setIsDialogOpen={setIsTypeDialogOpen}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stages Tab */}
          <TabsContent value="stages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Stages</CardTitle>
                <CardDescription>Configure approval stages with workflow types and organizational hierarchy</CardDescription>
              </CardHeader>
              <CardContent>
                <StagesView 
                  stages={stages}
                  approvers={approvers}
                  workflows={workflows}
                  workflowTypes={workflowTypes}
                  expandedStages={expandedStages}
                  onToggleStage={toggleStageExpansion}
                  onAddStage={handleAddStage}
                  onDeleteStage={handleDeleteStage}
                  onAddApprover={handleAddApprover}
                  onDeleteApprover={handleDeleteApprover}
                  isStageDialogOpen={isStageDialogOpen}
                  setIsStageDialogOpen={setIsStageDialogOpen}
                  isApproverDialogOpen={isApproverDialogOpen}
                  setIsApproverDialogOpen={setIsApproverDialogOpen}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approval Conditions</CardTitle>
                <CardDescription>Set up conditional rules for workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <ConditionsTable 
                  conditions={conditions}
                  workflows={workflows}
                  onAdd={handleAddCondition}
                  onDelete={handleDeleteCondition}
                  isDialogOpen={isConditionDialogOpen}
                  setIsDialogOpen={setIsConditionDialogOpen}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Workflow Form Component
const WorkflowForm: React.FC<{ onSubmit: (workflow: Omit<ApprovalWorkflow, 'workflow_id' | 'created_at' | 'modified_at'>) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    workflow_name: '',
    workflow_code: '',
    entity_type: '',
    description: '',
    is_active: true,
    created_by: 'admin',
    modified_by: 'admin',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.workflow_name && formData.workflow_code && formData.entity_type) {
      onSubmit(formData);
      setFormData({
        workflow_name: '',
        workflow_code: '',
        entity_type: '',
        description: '',
        is_active: true,
        created_by: 'admin',
        modified_by: 'admin',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="workflow_name">Workflow Name *</Label>
          <Input 
            id="workflow_name" 
            placeholder="Enter workflow name" 
            value={formData.workflow_name}
            onChange={(e) => setFormData({...formData, workflow_name: e.target.value})}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="workflow_code">Workflow Code *</Label>
          <Input 
            id="workflow_code" 
            placeholder="Enter unique code" 
            value={formData.workflow_code}
            onChange={(e) => setFormData({...formData, workflow_code: e.target.value})}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="entity_type">Entity Type *</Label>
          <Input 
            id="entity_type" 
            placeholder="e.g., Purchase Order" 
            value={formData.entity_type}
            onChange={(e) => setFormData({...formData, entity_type: e.target.value})}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe the workflow purpose" 
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="is_active" 
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full md:w-auto">Create Workflow</Button>
      </DialogFooter>
    </form>
  );
};

// Workflows Table Component
const WorkflowsTable: React.FC<{
  workflows: ApprovalWorkflow[];
  onSelect: (workflow: ApprovalWorkflow) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}> = ({ workflows, onSelect, onDelete, onEdit }) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workflow Name</TableHead>
            <TableHead className="hidden md:table-cell">Code</TableHead>
            <TableHead className="hidden lg:table-cell">Entity Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No workflows found. Create your first workflow to get started.
              </TableCell>
            </TableRow>
          ) : (
            workflows.map((workflow) => (
              <TableRow key={workflow.workflow_id}>
                <TableCell className="font-medium">{workflow.workflow_name}</TableCell>
                <TableCell className="hidden md:table-cell">{workflow.workflow_code}</TableCell>
                <TableCell className="hidden lg:table-cell">{workflow.entity_type}</TableCell>
                <TableCell>
                  <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                    {workflow.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(workflow.workflow_id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(workflow.workflow_id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Workflow Types Table Component
const WorkflowTypesTable: React.FC<{
  types: ApprovalWorkflowType[];
  workflows: ApprovalWorkflow[];
  onSelect: (type: ApprovalWorkflowType) => void;
  onDelete: (id: number) => void;
  onAdd: (type: Omit<ApprovalWorkflowType, 'workflow_types_id' | 'created_at' | 'modified_at'>) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}> = ({ types, workflows, onSelect, onDelete, onAdd, isDialogOpen, setIsDialogOpen }) => {
  const [formData, setFormData] = useState({
    workflow_types_name: '',
    workflow_id: 0,
    workflow_name: '',
    types_branches: '',
    is_active: true,
    created_by: 'admin',
    modified_by: 'admin',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.workflow_types_name && formData.workflow_id) {
      onAdd(formData);
      setFormData({
        workflow_types_name: '',
        workflow_id: 0,
        workflow_name: '',
        types_branches: '',
        is_active: true,
        created_by: 'admin',
        modified_by: 'admin',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Workflow Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type_name">Type Name *</Label>
                  <Input 
                    id="type_name" 
                    placeholder="Enter type name"
                    value={formData.workflow_types_name}
                    onChange={(e) => setFormData({...formData, workflow_types_name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workflow_select">Select Workflow *</Label>
                  <Select 
                    value={formData.workflow_id.toString()}
                    onValueChange={(value) => {
                      const selectedWorkflow = workflows.find(w => w.workflow_id === parseInt(value));
                      setFormData({
                        ...formData, 
                        workflow_id: parseInt(value),
                        workflow_name: selectedWorkflow?.workflow_name || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map(workflow => (
                        <SelectItem key={workflow.workflow_id} value={workflow.workflow_id.toString()}>
                          {workflow.workflow_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="branches">Branches</Label>
                  <Textarea 
                    id="branches" 
                    placeholder="Enter branches (comma-separated)"
                    value={formData.types_branches}
                    onChange={(e) => setFormData({...formData, types_branches: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="type_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="type_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Type</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type Name</TableHead>
              <TableHead className="hidden md:table-cell">Workflow</TableHead>
              <TableHead className="hidden lg:table-cell">Branches</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No workflow types configured.
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow key={type.workflow_types_id}>
                  <TableCell className="font-medium">{type.workflow_types_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{type.workflow_name}</TableCell>
                  <TableCell className="hidden lg:table-cell">{type.types_branches}</TableCell>
                  <TableCell>
                    <Badge variant={type.is_active ? 'default' : 'secondary'}>
                      {type.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(type.workflow_types_id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Stages View Component
const StagesView: React.FC<{
  stages: ApprovalWorkflowStage[];
  approvers: ApproverTable[];
  workflows: ApprovalWorkflow[];
  workflowTypes: ApprovalWorkflowType[];
  expandedStages: Set<number>;
  onToggleStage: (stageId: number) => void;
  onAddStage: (stage: Omit<ApprovalWorkflowStage, 'stage_id' | 'created_at'>) => void;
  onDeleteStage: (id: number) => void;
  onAddApprover: (approver: Omit<ApproverTable, 'approver_id' | 'created_at'>) => void;
  onDeleteApprover: (id: number) => void;
  isStageDialogOpen: boolean;
  setIsStageDialogOpen: (open: boolean) => void;
  isApproverDialogOpen: boolean;
  setIsApproverDialogOpen: (open: boolean) => void;
}> = ({ 
  stages, 
  approvers, 
  workflows,
  workflowTypes,
  expandedStages, 
  onToggleStage, 
  onAddStage, 
  onDeleteStage,
  onAddApprover,
  onDeleteApprover,
  isStageDialogOpen,
  setIsStageDialogOpen,
  isApproverDialogOpen,
  setIsApproverDialogOpen
}) => {
  const [stageFormData, setStageFormData] = useState({
    workflow_id: 0,
    workflow_types_id: 0,
    stage_name: '',
    stage_type: 'SEQUENTIAL',
    stage_order: 1,
    required_approvals: true,
    is_mandatory: true,
    can_skip: 0,
    escalation_hours: 24,
    com_sno: 0,
    div_sno: 0,
    brn_sno: 0,
    dept_sno: 0,
    is_active: true,
  });

  const [selectedStageForApprover, setSelectedStageForApprover] = useState<number>(0);
  const [filteredWorkflowTypes, setFilteredWorkflowTypes] = useState<ApprovalWorkflowType[]>([]);

  const handleWorkflowChange = (workflowId: number) => {
    setStageFormData({...stageFormData, workflow_id: workflowId, workflow_types_id: 0});
    const filtered = workflowTypes.filter(wt => wt.workflow_id === workflowId);
    setFilteredWorkflowTypes(filtered);
  };

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stageFormData.stage_name && stageFormData.workflow_id) {
      onAddStage(stageFormData);
      setStageFormData({
        workflow_id: 0,
        workflow_types_id: 0,
        stage_name: '',
        stage_type: 'SEQUENTIAL',
        stage_order: 1,
        required_approvals: true,
        is_mandatory: true,
        can_skip: 0,
        escalation_hours: 24,
        com_sno: 0,
        div_sno: 0,
        brn_sno: 0,
        dept_sno: 0,
        is_active: true,
      });
      setFilteredWorkflowTypes([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Workflow Stage</DialogTitle>
              <DialogDescription>
                Configure stage with workflow type and organizational hierarchy
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStageSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="workflow_stage">Select Workflow *</Label>
                  <Select 
                    value={stageFormData.workflow_id.toString()}
                    onValueChange={(value) => handleWorkflowChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map(workflow => (
                        <SelectItem key={workflow.workflow_id} value={workflow.workflow_id.toString()}>
                          {workflow.workflow_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="workflow_type">Select Workflow Type *</Label>
                  <Select 
                    value={stageFormData.workflow_types_id.toString()}
                    onValueChange={(value) => setStageFormData({...stageFormData, workflow_types_id: parseInt(value)})}
                    disabled={!stageFormData.workflow_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose workflow type" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredWorkflowTypes.map(type => (
                        <SelectItem key={type.workflow_types_id} value={type.workflow_types_id.toString()}>
                          {type.workflow_types_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stage_name">Stage Name *</Label>
                  <Input 
                    id="stage_name" 
                    placeholder="Enter stage name"
                    value={stageFormData.stage_name}
                    onChange={(e) => setStageFormData({...stageFormData, stage_name: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stage_order">Stage Order</Label>
                    <Input 
                      id="stage_order" 
                      type="number" 
                      placeholder="1"
                      value={stageFormData.stage_order}
                      onChange={(e) => setStageFormData({...stageFormData, stage_order: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stage_type">Stage Type</Label>
                    <Select
                      value={stageFormData.stage_type}
                      onValueChange={(value) => setStageFormData({...stageFormData, stage_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEQUENTIAL">Sequential</SelectItem>
                        <SelectItem value="PARALLEL">Parallel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Organizational Hierarchy Section */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Organizational Hierarchy</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="company">Company ID</Label>
                      <Input 
                        id="company" 
                        type="number" 
                        placeholder="Company ID"
                        value={stageFormData.com_sno || ''}
                        onChange={(e) => setStageFormData({...stageFormData, com_sno: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="division">Division ID</Label>
                      <Input 
                        id="division" 
                        type="number" 
                        placeholder="Division ID"
                        value={stageFormData.div_sno || ''}
                        onChange={(e) => setStageFormData({...stageFormData, div_sno: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="branch">Branch ID</Label>
                      <Input 
                        id="branch" 
                        type="number" 
                        placeholder="Branch ID"
                        value={stageFormData.brn_sno || ''}
                        onChange={(e) => setStageFormData({...stageFormData, brn_sno: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department ID</Label>
                      <Input 
                        id="department" 
                        type="number" 
                        placeholder="Department ID"
                        value={stageFormData.dept_sno || ''}
                        onChange={(e) => setStageFormData({...stageFormData, dept_sno: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="escalation">Escalation Hours</Label>
                  <Input 
                    id="escalation" 
                    type="number" 
                    placeholder="24"
                    value={stageFormData.escalation_hours}
                    onChange={(e) => setStageFormData({...stageFormData, escalation_hours: parseInt(e.target.value) || 24})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="required_approvals"
                      checked={stageFormData.required_approvals}
                      onCheckedChange={(checked) => setStageFormData({...stageFormData, required_approvals: checked})}
                    />
                    <Label htmlFor="required_approvals">Required Approvals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is_mandatory"
                      checked={stageFormData.is_mandatory}
                      onCheckedChange={(checked) => setStageFormData({...stageFormData, is_mandatory: checked})}
                    />
                    <Label htmlFor="is_mandatory">Mandatory</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Stage</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {stages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No stages configured. Add stages to define the approval flow.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {stages.map((stage) => {
            const stageApprovers = approvers.filter((a) => a.stage_id === stage.stage_id);
            const isExpanded = expandedStages.has(stage.stage_id);
            const workflowType = workflowTypes?.find(wt => wt.workflow_types_id === stage.workflow_types_id);

            return (
              <Card key={stage.stage_id} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onToggleStage(stage.stage_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="font-mono text-xs">
                            #{stage.stage_order}
                          </Badge>
                          <h3 className="font-semibold">{stage.stage_name}</h3>
                          {workflowType && (
                            <Badge variant="secondary" className="text-xs">
                              {workflowType.workflow_types_name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.stage_type} • {stageApprovers.length} approver(s)
                          {(stage.com_sno || stage.div_sno || stage.brn_sno || stage.dept_sno) && (
                            <span className="ml-2">
                              • Co:{stage.com_sno} Div:{stage.div_sno} Br:{stage.brn_sno} Dept:{stage.dept_sno}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {stage.required_approvals && (
                        <Badge variant="secondary" className="hidden sm:inline-flex">Required</Badge>
                      )}
                      {stage.is_mandatory && (
                        <Badge variant="default" className="hidden sm:inline-flex">Mandatory</Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStage(stage.stage_id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-muted/30">
                    <div className="p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h4 className="font-medium text-sm">Approvers</h4>
                        <Dialog open={isApproverDialogOpen} onOpenChange={setIsApproverDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedStageForApprover(stage.stage_id)}
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              Add Approver
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Approver to Stage</DialogTitle>
                            </DialogHeader>
                            <ApproverForm 
                              stageId={selectedStageForApprover} 
                              onSubmit={onAddApprover}
                              workflowId={stage.workflow_id}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>

                      {stageApprovers.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No approvers assigned to this stage.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead className="hidden sm:table-cell">Company</TableHead>
                                <TableHead className="hidden md:table-cell">Division</TableHead>
                                <TableHead className="hidden lg:table-cell">Branch</TableHead>
                                <TableHead className="hidden lg:table-cell">Department</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stageApprovers.map((approver) => (
                                <TableRow key={approver.approver_id}>
                                  <TableCell>{approver.nt_sign_up_sno}</TableCell>
                                  <TableCell className="hidden sm:table-cell">{approver.com_sno}</TableCell>
                                  <TableCell className="hidden md:table-cell">{approver.div_sno}</TableCell>
                                  <TableCell className="hidden lg:table-cell">{approver.brn_sno}</TableCell>
                                  <TableCell className="hidden lg:table-cell">{approver.dept_sno}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => onDeleteApprover(approver.approver_id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Approver Form Component
const ApproverForm: React.FC<{ 
  stageId: number; 
  workflowId: number;
  onSubmit: (approver: Omit<ApproverTable, 'approver_id' | 'created_at'>) => void;
}> = ({ stageId, workflowId, onSubmit }) => {
  const [formData, setFormData] = useState({
    nt_sign_up_sno: 0,
    workflow_id: workflowId,
    stage_id: stageId,
    com_sno: 0,
    div_sno: 0,
    brn_sno: 0,
    dept_sno: 0,
    created_by: 'admin',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nt_sign_up_sno) {
      onSubmit(formData);
      setFormData({
        nt_sign_up_sno: 0,
        workflow_id: workflowId,
        stage_id: stageId,
        com_sno: 0,
        div_sno: 0,
        brn_sno: 0,
        dept_sno: 0,
        created_by: 'admin',
        is_active: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="user_id">User ID *</Label>
          <Input
            id="user_id"
            type="number"
            placeholder="Enter user ID"
            value={formData.nt_sign_up_sno || ''}
            onChange={(e) => setFormData({...formData, nt_sign_up_sno: parseInt(e.target.value) || 0})}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company ID</Label>
            <Input
              id="company"
              type="number"
              placeholder="Company ID"
              value={formData.com_sno || ''}
              onChange={(e) => setFormData({...formData, com_sno: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="division">Division ID</Label>
            <Input
              id="division"
              type="number"
              placeholder="Division ID"
              value={formData.div_sno || ''}
              onChange={(e) => setFormData({...formData, div_sno: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="branch">Branch ID</Label>
            <Input
              id="branch"
              type="number"
              placeholder="Branch ID"
              value={formData.brn_sno || ''}
              onChange={(e) => setFormData({...formData, brn_sno: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department ID</Label>
            <Input
              id="department"
              type="number"
              placeholder="Department ID"
              value={formData.dept_sno || ''}
              onChange={(e) => setFormData({...formData, dept_sno: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="approver_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
          />
          <Label htmlFor="approver_active">Active</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Add Approver</Button>
      </DialogFooter>
    </form>
  );
};

// Conditions Table Component
const ConditionsTable: React.FC<{ 
  conditions: ApprovalCondition[];
  workflows: ApprovalWorkflow[];
  workflowTypes: ApprovalWorkflowType[];
  stages: ApprovalWorkflowStage[];
  onAdd: (condition: Omit<ApprovalCondition, 'condition_id' | 'created_at'>) => void;
  onDelete: (id: number) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}> = ({ conditions, workflows, workflowTypes, stages, onAdd, onDelete, isDialogOpen, setIsDialogOpen }) => {
  const [formData, setFormData] = useState({
    workflow_id: 0,
    workflow_types_id: 0,
    stage_id: 0,
    condition_name: '',
    condition_type: '',
    operator_type: '',
    condition_value: '',
    priority_order: 1,
    is_active: true,
  });

  const [filteredWorkflowTypes, setFilteredWorkflowTypes] = useState<ApprovalWorkflowType[]>([]);
  const [filteredStages, setFilteredStages] = useState<ApprovalWorkflowStage[]>([]);

  const handleWorkflowChange = (workflowId: number) => {
    setFormData({
      ...formData,
      workflow_id: workflowId,
      workflow_types_id: 0,
      stage_id: 0
    });
    const filtered = workflowTypes.filter(wt => wt.workflow_id === workflowId);
    setFilteredWorkflowTypes(filtered);
    setFilteredStages([]);
  };

  const handleWorkflowTypeChange = (workflowTypeId: number) => {
    setFormData({
      ...formData,
      workflow_types_id: workflowTypeId,
      stage_id: 0
    });
    const filtered = stages.filter(s => s.workflow_types_id === workflowTypeId);
    setFilteredStages(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.condition_name && formData.workflow_id) {
      onAdd(formData);
      setFormData({
        workflow_id: 0,
        workflow_types_id: 0,
        stage_id: 0,
        condition_name: '',
        condition_type: '',
        operator_type: '',
        condition_value: '',
        priority_order: 1,
        is_active: true,
      });
      setFilteredWorkflowTypes([]);
      setFilteredStages([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Condition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Approval Condition</DialogTitle>
              <DialogDescription>
                Configure condition with workflow type and stage
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="workflow_condition">Select Workflow *</Label>
                  <Select 
                    value={formData.workflow_id.toString()}
                    onValueChange={(value) => handleWorkflowChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map(workflow => (
                        <SelectItem key={workflow.workflow_id} value={workflow.workflow_id.toString()}>
                          {workflow.workflow_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="workflow_type_condition">Select Workflow Type *</Label>
                  <Select 
                    value={formData.workflow_types_id.toString()}
                    onValueChange={(value) => handleWorkflowTypeChange(parseInt(value))}
                    disabled={!formData.workflow_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose workflow type" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredWorkflowTypes.length === 0 ? (
                        <SelectItem value="0" disabled>No types available</SelectItem>
                      ) : (
                        filteredWorkflowTypes.map(type => (
                          <SelectItem key={type.workflow_types_id} value={type.workflow_types_id.toString()}>
                            {type.workflow_types_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stage_condition">Select Stage *</Label>
                  <Select 
                    value={formData.stage_id.toString()}
                    onValueChange={(value) => setFormData({...formData, stage_id: parseInt(value)})}
                    disabled={!formData.workflow_types_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStages.length === 0 ? (
                        <SelectItem value="0" disabled>No stages available</SelectItem>
                      ) : (
                        filteredStages.map(stage => (
                          <SelectItem key={stage.stage_id} value={stage.stage_id.toString()}>
                            {stage.stage_name} (Order: {stage.stage_order})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition_name">Condition Name *</Label>
                  <Input 
                    id="condition_name" 
                    placeholder="e.g., Amount threshold"
                    value={formData.condition_name}
                    onChange={(e) => setFormData({...formData, condition_name: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="condition_type">Condition Type</Label>
                    <Select
                      value={formData.condition_type}
                      onValueChange={(value) => setFormData({...formData, condition_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AMOUNT">Amount</SelectItem>
                        <SelectItem value="PRIORITY">Priority</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="operator">Operator</Label>
                    <Select
                      value={formData.operator_type}
                      onValueChange={(value) => setFormData({...formData, operator_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">&gt;</SelectItem>
                        <SelectItem value="<">&lt;</SelectItem>
                        <SelectItem value="=">=</SelectItem>
                        <SelectItem value=">=">&gt;=</SelectItem>
                        <SelectItem value="<=">&lt;=</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="condition_value">Condition Value</Label>
                  <Input 
                    id="condition_value" 
                    placeholder="Enter value"
                    value={formData.condition_value}
                    onChange={(e) => setFormData({...formData, condition_value: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority Order</Label>
                  <Input 
                    id="priority" 
                    type="number" 
                    placeholder="1"
                    value={formData.priority_order}
                    onChange={(e) => setFormData({...formData, priority_order: parseInt(e.target.value) || 1})}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="condition_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="condition_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Condition</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Stage</TableHead>
              <TableHead className="hidden lg:table-cell">Operator</TableHead>
              <TableHead className="hidden xl:table-cell">Value</TableHead>
              <TableHead className="hidden sm:table-cell">Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conditions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No conditions configured.
                </TableCell>
              </TableRow>
            ) : (
              conditions.map((condition) => {
                const stage = stages?.find(s => s.stage_id === condition.stage_id);
                const workflowType = workflowTypes?.find(wt => wt.workflow_types_id === condition.workflow_types_id);
                
                return (
                  <TableRow key={condition.condition_id}>
                    <TableCell className="font-medium">
                      <div>
                        {condition.condition_name}
                        {workflowType && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {workflowType.workflow_types_name}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{condition.condition_type}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {stage ? `${stage.stage_name} (#${stage.stage_order})` : '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{condition.operator_type}</TableCell>
                    <TableCell className="hidden xl:table-cell">{condition.condition_value}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{condition.priority_order}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={condition.is_active ? 'default' : 'secondary'}>
                        {condition.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDelete(condition.condition_id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};


export default ApprovalWorkflowPage;
