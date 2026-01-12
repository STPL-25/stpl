// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Plus, Trash2, Save, X, Edit, PlusCircle } from 'lucide-react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { toast } from '@/components/ui/use-toast';

// // ============================================================
// // INTERFACES - All interconnected entities
// // ============================================================

// interface Workflow {
//   workflow_id: number;
//   workflow_name: string;
//   workflow_code: string;
//   entity_type: string;
//   description: string;
//   is_active: string;
//   created_at?: string;
//   updated_at?: string;
// }

// interface WorkflowType {
//   workflow_types_id: number;
//   workflow_types_name: string;
//   workflow_id: number; // FK to Workflow
//   types_branches: string; // 'ALL' or 'SPECIFIC'
//   created_at?: string;
// }

// interface AuthBranch {
//   workflow_auth_branches_id?: number;
//   workflow_id: number; // FK to Workflow
//   workflow_types_id: number; // FK to WorkflowType
//   com_sno: number;
//   div_sno: number;
//   brn_sno: number;
//   dept_sno: number;
// }

// interface Stage {
//   stage_id?: number;
//   workflow_id: number; // FK to Workflow
//   workflow_types_id: number; // FK to WorkflowType - ADDED FOR PROPER LINKING
//   stage_order: number;
//   stage_name: string;
//   stage_type: string; // 'SEQUENTIAL' or 'PARALLEL'
//   required_approvals: string;
//   is_mandatory: string;
//   can_skip: string;
//   escalation_hours: number;
// }

// interface Approver {
//   approver_id?: number;
//   nt_sign_up_sno: number; // FK to User
//   workflow_id: number; // FK to Workflow
//   workflow_types_id: number; // FK to WorkflowType - ADDED
//   stage_id: number; // FK to Stage
//   com_sno: number;
//   div_sno: number;
//   brn_sno: number;
//   dept_sno: number;
// }

// interface SignUpUser {
//   nt_sign_up_sno: number;
//   ecno: string;
//   name: string;
//   email?: string;
//   department?: string;
// }

// // Complete configuration payload structure
// interface WorkflowConfiguration {
//   workflow_id: number;
//   workflow_type: WorkflowType;
//   auth_branches: AuthBranch[];
//   stages: Stage[];
//   approvers: Approver[];
// }

// // ============================================================
// // MOCK DATA
// // ============================================================

// const INITIAL_WORKFLOWS: Workflow[] = [
//   {
//     workflow_id: 1,
//     workflow_name: 'Purchase Requisition',
//     workflow_code: 'PR',
//     entity_type: 'PR',
//     description: 'Purchase Requisition Approval Workflow',
//     is_active: 'Y',
//     created_at: '2026-01-01',
//   },
//   {
//     workflow_id: 2,
//     workflow_name: 'Invoice Approval',
//     workflow_code: 'INV',
//     entity_type: 'INV',
//     description: 'Invoice Approval Workflow',
//     is_active: 'Y',
//     created_at: '2026-01-01',
//   },
// ];

// const MOCK_USERS: SignUpUser[] = [
//   { nt_sign_up_sno: 101, ecno: 'EMP001', name: 'Rajesh Kumar', department: 'Finance' },
//   { nt_sign_up_sno: 102, ecno: 'EMP002', name: 'Priya Sharma', department: 'Procurement' },
//   { nt_sign_up_sno: 103, ecno: 'EMP003', name: 'Amit Patel', department: 'Operations' },
//   { nt_sign_up_sno: 104, ecno: 'EMP004', name: 'Sunita Reddy', department: 'Management' },
//   { nt_sign_up_sno: 105, ecno: 'EMP005', name: 'Vikram Singh', department: 'Finance' },
//   { nt_sign_up_sno: 106, ecno: 'EMP006', name: 'Anjali Verma', department: 'HR' },
// ];

// // ============================================================
// // MAIN COMPONENT
// // ============================================================

// const WorkflowPostingForm: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('workflow');
//   const [viewMode, setViewMode] = useState<'list' | 'configure'>('list');

//   // Workflow State
//   const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
//   const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
//   const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

//   // New Workflow Form State
//   const [newWorkflow, setNewWorkflow] = useState<Partial<Workflow>>({
//     workflow_name: '',
//     workflow_code: '',
//     entity_type: '',
//     description: '',
//     is_active: 'Y',
//   });

//   // Dialog State
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

//   // Workflow Type State (1:1 with Workflow)
//   const [workflowType, setWorkflowType] = useState<Partial<WorkflowType>>({
//     workflow_types_name: '',
//     types_branches: 'ALL',
//   });

//   // Auth Branches State (Many to WorkflowType)
//   const [authBranches, setAuthBranches] = useState<AuthBranch[]>([]);
//   const [currentAuthBranch, setCurrentAuthBranch] = useState<Partial<AuthBranch>>({
//     com_sno: 0,
//     div_sno: 0,
//     brn_sno: 0,
//     dept_sno: 0,
//   });

//   // Stages State (Many to Workflow)
//   const [stages, setStages] = useState<Stage[]>([]);
//   const [currentStage, setCurrentStage] = useState<Partial<Stage>>({
//     stage_name: '',
//     stage_order: 1,
//     stage_type: 'SEQUENTIAL',
//     required_approvals: 'Y',
//     is_mandatory: 'Y',
//     can_skip: 'N',
//     escalation_hours: 24,
//   });

//   // Approvers State (Many to Stage)
//   const [selectedStageForApprover, setSelectedStageForApprover] = useState<number | null>(null);
//   const [approvers, setApprovers] = useState<Approver[]>([]);
//   const [currentApprover, setCurrentApprover] = useState<Partial<Approver>>({
//     nt_sign_up_sno: 0,
//     com_sno: 0,
//     div_sno: 0,
//     brn_sno: 0,
//     dept_sno: 0,
//   });

//   const [users] = useState<SignUpUser[]>(MOCK_USERS);

//   // ============================================================
//   // VALIDATION FUNCTIONS
//   // ============================================================

//   const validateWorkflowForm = (): boolean => {
//     if (!newWorkflow.workflow_name?.trim()) {
//       alert('Workflow name is required');
//       return false;
//     }
//     if (!newWorkflow.workflow_code?.trim()) {
//       alert('Workflow code is required');
//       return false;
//     }
//     if (!newWorkflow.entity_type?.trim()) {
//       alert('Entity type is required');
//       return false;
//     }

//     const isDuplicate = workflows.some(
//       (w) =>
//         w.workflow_code.toLowerCase() === newWorkflow.workflow_code?.toLowerCase() &&
//         w.workflow_id !== editingWorkflow?.workflow_id
//     );

//     if (isDuplicate) {
//       alert('Workflow code already exists');
//       return false;
//     }

//     return true;
//   };

//   const validateWorkflowType = (): boolean => {
//     if (!workflowType.workflow_types_name?.trim()) {
//       alert('Workflow type name is required');
//       return false;
//     }
//     return true;
//   };

//   const validateConfiguration = (): boolean => {
//     if (!selectedWorkflowId) {
//       alert('Please select a workflow');
//       return false;
//     }

//     if (!workflowType.workflow_types_name) {
//       alert('Please configure workflow type');
//       return false;
//     }

//     if (workflowType.types_branches === 'SPECIFIC' && authBranches.length === 0) {
//       alert('Please add at least one authorized branch for specific branch type');
//       return false;
//     }

//     if (stages.length === 0) {
//       alert('Please add at least one approval stage');
//       return false;
//     }

//     if (approvers.length === 0) {
//       alert('Please add at least one approver to stages');
//       return false;
//     }

//     // Check if all stages have approvers
//     const stagesWithoutApprovers = stages.filter(
//       (stage) => !approvers.some((approver) => approver.stage_id === stage.stage_id)
//     );

//     if (stagesWithoutApprovers.length > 0) {
//       alert(`The following stages don't have approvers: ${stagesWithoutApprovers.map(s => s.stage_name).join(', ')}`);
//       return false;
//     }

//     return true;
//   };

//   // ============================================================
//   // WORKFLOW CRUD OPERATIONS
//   // ============================================================

//   const handleCreateWorkflow = () => {
//     if (!validateWorkflowForm()) return;

//     const workflow: Workflow = {
//       workflow_id: Date.now(),
//       workflow_name: newWorkflow.workflow_name!,
//       workflow_code: newWorkflow.workflow_code!.toUpperCase(),
//       entity_type: newWorkflow.entity_type!.toUpperCase(),
//       description: newWorkflow.description || '',
//       is_active: newWorkflow.is_active || 'Y',
//       created_at: new Date().toISOString(),
//     };

//     setWorkflows([...workflows, workflow]);
//     setIsCreateDialogOpen(false);
//     resetWorkflowForm();
//     alert('Workflow created successfully!');
//   };

//   const handleEditWorkflow = (workflow: Workflow) => {
//     setEditingWorkflow(workflow);
//     setNewWorkflow(workflow);
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateWorkflow = () => {
//     if (!validateWorkflowForm() || !editingWorkflow) return;

//     const updatedWorkflows = workflows.map((w) =>
//       w.workflow_id === editingWorkflow.workflow_id
//         ? {
//             ...w,
//             ...newWorkflow,
//             updated_at: new Date().toISOString(),
//           }
//         : w
//     );

//     setWorkflows(updatedWorkflows);
//     setIsEditDialogOpen(false);
//     setEditingWorkflow(null);
//     resetWorkflowForm();
//     alert('Workflow updated successfully!');
//   };

//   const handleDeleteWorkflow = (workflowId: number) => {
//     if (window.confirm('Are you sure you want to delete this workflow? All related configurations will be lost.')) {
//       setWorkflows(workflows.filter((w) => w.workflow_id !== workflowId));
//       alert('Workflow deleted successfully!');
//     }
//   };

//   const toggleWorkflowStatus = (workflowId: number) => {
//     setWorkflows(
//       workflows.map((w) =>
//         w.workflow_id === workflowId
//           ? { ...w, is_active: w.is_active === 'Y' ? 'N' : 'Y' }
//           : w
//       )
//     );
//   };

//   const resetWorkflowForm = () => {
//     setNewWorkflow({
//       workflow_name: '',
//       workflow_code: '',
//       entity_type: '',
//       description: '',
//       is_active: 'Y',
//     });
//   };

//   // ============================================================
//   // CONFIGURATION OPERATIONS
//   // ============================================================

//   const handleSelectWorkflowForConfig = (workflowId: number) => {
//     setSelectedWorkflowId(workflowId);
//     setViewMode('configure');
//     setActiveTab('type');
//   };

//   // Add Auth Branch (with proper FK linking)
//   const handleAddAuthBranch = () => {
//     if (!selectedWorkflowId) {
//       alert('Please select a workflow first');
//       return;
//     }

//     if (!currentAuthBranch.com_sno || !currentAuthBranch.brn_sno) {
//       alert('Please fill company and branch details');
//       return;
//     }

//     const workflowTypeId = Date.now(); // This would be the actual workflow_types_id

//     const newBranch: AuthBranch = {
//       workflow_auth_branches_id: Date.now(),
//       workflow_id: selectedWorkflowId, // FK to Workflow
//       workflow_types_id: workflowTypeId, // FK to WorkflowType
//       com_sno: currentAuthBranch.com_sno!,
//       div_sno: currentAuthBranch.div_sno || 0,
//       brn_sno: currentAuthBranch.brn_sno!,
//       dept_sno: currentAuthBranch.dept_sno || 0,
//     };

//     setAuthBranches([...authBranches, newBranch]);
//     setCurrentAuthBranch({ com_sno: 0, div_sno: 0, brn_sno: 0, dept_sno: 0 });
//   };

//   const handleRemoveAuthBranch = (id: number) => {
//     setAuthBranches(authBranches.filter((b) => b.workflow_auth_branches_id !== id));
//   };

//   // Add Stage (with proper FK linking)
//   const handleAddStage = () => {
//     if (!selectedWorkflowId) {
//       alert('Please select a workflow first');
//       return;
//     }

//     if (!currentStage.stage_name) {
//       alert('Please enter stage name');
//       return;
//     }

//     if (!validateWorkflowType()) {
//       alert('Please configure workflow type first');
//       return;
//     }

//     const workflowTypeId = Date.now(); // This would be the actual workflow_types_id

//     const newStage: Stage = {
//       stage_id: Date.now(),
//       workflow_id: selectedWorkflowId, // FK to Workflow
//       workflow_types_id: workflowTypeId, // FK to WorkflowType
//       stage_order: currentStage.stage_order!,
//       stage_name: currentStage.stage_name!,
//       stage_type: currentStage.stage_type!,
//       required_approvals: currentStage.required_approvals!,
//       is_mandatory: currentStage.is_mandatory!,
//       can_skip: currentStage.can_skip!,
//       escalation_hours: currentStage.escalation_hours!,
//     };

//     setStages([...stages, newStage]);
//     setCurrentStage({
//       stage_name: '',
//       stage_order: stages.length + 2,
//       stage_type: 'SEQUENTIAL',
//       required_approvals: 'Y',
//       is_mandatory: 'Y',
//       can_skip: 'N',
//       escalation_hours: 24,
//     });
//   };

//   const handleRemoveStage = (id: number) => {
//     if (window.confirm('Removing this stage will also remove all associated approvers. Continue?')) {
//       setStages(stages.filter((s) => s.stage_id !== id));
//       setApprovers(approvers.filter((a) => a.stage_id !== id));
//     }
//   };

//   // Add Approver (with proper FK linking)
//   const handleAddApprover = () => {
//     if (!selectedWorkflowId || !selectedStageForApprover) {
//       alert('Please select workflow and stage first');
//       return;
//     }

//     if (!currentApprover.nt_sign_up_sno) {
//       alert('Please select a user');
//       return;
//     }

//     // Check if approver already exists for this stage
//     const approverExists = approvers.some(
//       (a) => a.stage_id === selectedStageForApprover && a.nt_sign_up_sno === currentApprover.nt_sign_up_sno
//     );

//     if (approverExists) {
//       alert('This user is already an approver for this stage');
//       return;
//     }

//     const workflowTypeId = Date.now(); // This would be the actual workflow_types_id

//     const newApprover: Approver = {
//       approver_id: Date.now(),
//       workflow_id: selectedWorkflowId, // FK to Workflow
//       workflow_types_id: workflowTypeId, // FK to WorkflowType
//       stage_id: selectedStageForApprover, // FK to Stage
//       nt_sign_up_sno: currentApprover.nt_sign_up_sno!, // FK to User
//       com_sno: currentApprover.com_sno || 0,
//       div_sno: currentApprover.div_sno || 0,
//       brn_sno: currentApprover.brn_sno || 0,
//       dept_sno: currentApprover.dept_sno || 0,
//     };

//     setApprovers([...approvers, newApprover]);
//     setCurrentApprover({
//       nt_sign_up_sno: 0,
//       com_sno: 0,
//       div_sno: 0,
//       brn_sno: 0,
//       dept_sno: 0,
//     });
//   };

//   const handleRemoveApprover = (id: number) => {
//     setApprovers(approvers.filter((a) => a.approver_id !== id));
//   };

//   // ============================================================
//   // SUBMIT COMPLETE CONFIGURATION
//   // ============================================================

//   const handleSubmit = async () => {
//     if (!validateConfiguration()) return;

//     // Generate workflow_types_id
//     const workflowTypeId = Date.now();

//     // Create complete workflow type with FK
//     const completeWorkflowType: WorkflowType = {
//       workflow_types_id: workflowTypeId,
//       workflow_id: selectedWorkflowId!,
//       workflow_types_name: workflowType.workflow_types_name!,
//       types_branches: workflowType.types_branches!,
//       created_at: new Date().toISOString(),
//     };

//     // Update all auth branches with correct workflow_types_id
//     const updatedAuthBranches = authBranches.map((branch) => ({
//       ...branch,
//       workflow_types_id: workflowTypeId,
//     }));

//     // Update all stages with correct workflow_types_id
//     const updatedStages = stages.map((stage) => ({
//       ...stage,
//       workflow_types_id: workflowTypeId,
//     }));

//     // Update all approvers with correct workflow_types_id
//     const updatedApprovers = approvers.map((approver) => ({
//       ...approver,
//       workflow_types_id: workflowTypeId,
//     }));

//     // Complete interconnected payload
//     const payload: WorkflowConfiguration = {
//       workflow_id: selectedWorkflowId!,
//       workflow_type: completeWorkflowType,
//       auth_branches: updatedAuthBranches,
//       stages: updatedStages,
//       approvers: updatedApprovers,
//     };

//     console.log('='.repeat(70));
//     console.log('COMPLETE WORKFLOW CONFIGURATION PAYLOAD:');
//     console.log('='.repeat(70));
//     console.log(JSON.stringify(payload, null, 2));
//     console.log('='.repeat(70));

//     // API call would go here
//     try {
//       // const response = await fetch('/api/workflow/configure', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(payload),
//       // });
//       // const result = await response.json();

//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       alert('✅ Workflow configuration saved successfully!\n\nCheck console for complete payload structure.');
//       handleReset();
//     } catch (error) {
//       console.error('Error saving workflow configuration:', error);
//       alert('❌ Error saving workflow configuration');
//     }
//   };

//   // Reset all configuration
//   const handleReset = () => {
//     setSelectedWorkflowId(null);
//     setWorkflowType({ workflow_types_name: '', types_branches: 'ALL' });
//     setAuthBranches([]);
//     setStages([]);
//     setApprovers([]);
//     setCurrentAuthBranch({ com_sno: 0, div_sno: 0, brn_sno: 0, dept_sno: 0 });
//     setCurrentStage({
//       stage_name: '',
//       stage_order: 1,
//       stage_type: 'SEQUENTIAL',
//       required_approvals: 'Y',
//       is_mandatory: 'Y',
//       can_skip: 'N',
//       escalation_hours: 24,
//     });
//     setCurrentApprover({ nt_sign_up_sno: 0, com_sno: 0, div_sno: 0, brn_sno: 0, dept_sno: 0 });
//     setSelectedStageForApprover(null);
//     setViewMode('list');
//     setActiveTab('workflow');
//   };

//   // ============================================================
//   // DIALOG COMPONENTS
//   // ============================================================

//   const WorkflowFormDialog = ({
//     isOpen,
//     onClose,
//     onSave,
//     title,
//   }: {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: () => void;
//     title: string;
//   }) => (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           <DialogDescription>
//             {title === 'Create New Workflow'
//               ? 'Fill in the details to create a new workflow'
//               : 'Update the workflow details'}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="wf-name">Workflow Name *</Label>
//             <Input
//               id="wf-name"
//               placeholder="e.g., Purchase Requisition"
//               value={newWorkflow.workflow_name || ''}
//               onChange={(e) => setNewWorkflow({ ...newWorkflow, workflow_name: e.target.value })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="wf-code">Workflow Code *</Label>
//             <Input
//               id="wf-code"
//               placeholder="e.g., PR"
//               value={newWorkflow.workflow_code || ''}
//               onChange={(e) =>
//                 setNewWorkflow({ ...newWorkflow, workflow_code: e.target.value.toUpperCase() })
//               }
//               maxLength={10}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="entity-type">Entity Type *</Label>
//             <Input
//               id="entity-type"
//               placeholder="e.g., PR, INV, PO"
//               value={newWorkflow.entity_type || ''}
//               onChange={(e) =>
//                 setNewWorkflow({ ...newWorkflow, entity_type: e.target.value.toUpperCase() })
//               }
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="wf-desc">Description</Label>
//             <Textarea
//               id="wf-desc"
//               placeholder="Describe the workflow purpose..."
//               value={newWorkflow.description || ''}
//               onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
//               rows={3}
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="is-active"
//               checked={newWorkflow.is_active === 'Y'}
//               onCheckedChange={(checked) =>
//                 setNewWorkflow({ ...newWorkflow, is_active: checked ? 'Y' : 'N' })
//               }
//             />
//             <Label htmlFor="is-active" className="cursor-pointer">
//               Active
//             </Label>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={onSave}>
//             {title === 'Create New Workflow' ? 'Create' : 'Update'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );

//   // ============================================================
//   // WORKFLOW LIST VIEW
//   // ============================================================

//   const WorkflowListView = () => (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle>Workflow Management</CardTitle>
//             <CardDescription>Create and manage approval workflows</CardDescription>
//           </div>
//           <Button onClick={() => setIsCreateDialogOpen(true)}>
//             <PlusCircle className="mr-2 h-4 w-4" /> Create Workflow
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[500px]">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Code</TableHead>
//                 <TableHead>Entity Type</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {workflows.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center text-gray-500 py-8">
//                     No workflows found. Create your first workflow.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 workflows.map((workflow) => (
//                   <TableRow key={workflow.workflow_id}>
//                     <TableCell className="font-medium">{workflow.workflow_name}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline">{workflow.workflow_code}</Badge>
//                     </TableCell>
//                     <TableCell>{workflow.entity_type}</TableCell>
//                     <TableCell className="max-w-xs truncate">{workflow.description}</TableCell>
//                     <TableCell>
//                       <Badge variant={workflow.is_active === 'Y' ? 'default' : 'secondary'}>
//                         {workflow.is_active === 'Y' ? 'Active' : 'Inactive'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleSelectWorkflowForConfig(workflow.workflow_id)}
//                         >
//                           Configure
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleEditWorkflow(workflow)}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => toggleWorkflowStatus(workflow.workflow_id)}
//                         >
//                           {workflow.is_active === 'Y' ? 'Deactivate' : 'Activate'}
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleDeleteWorkflow(workflow.workflow_id)}
//                         >
//                           <Trash2 className="h-4 w-4 text-red-500" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );

//   // ============================================================
//   // MAIN RENDER
//   // ============================================================

//   return (
//     <div className="container mx-auto p-6 ">
//       {viewMode === 'list' && (
//         <>
//           <WorkflowListView />
//           <WorkflowFormDialog
//             isOpen={isCreateDialogOpen}
//             onClose={() => {
//               setIsCreateDialogOpen(false);
//               resetWorkflowForm();
//             }}
//             onSave={handleCreateWorkflow}
//             title="Create New Workflow"
//           />
//           <WorkflowFormDialog
//             isOpen={isEditDialogOpen}
//             onClose={() => {
//               setIsEditDialogOpen(false);
//               setEditingWorkflow(null);
//               resetWorkflowForm();
//             }}
//             onSave={handleUpdateWorkflow}
//             title="Edit Workflow"
//           />
//         </>
//       )}

//       {viewMode === 'configure' && (
//         <>
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" onClick={handleReset}>
//                 <X className="mr-2 h-4 w-4" /> Back to List
//               </Button>
//               {selectedWorkflowId && (
//                 <Badge variant="default" className="text-sm px-4 py-2">
//                   Configuring: {workflows.find((w) => w.workflow_id === selectedWorkflowId)?.workflow_name}
//                 </Badge>
//               )}
//             </div>
//           </div>

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="type">1. Type</TabsTrigger>
//               <TabsTrigger value="branches">2. Branches</TabsTrigger>
//               <TabsTrigger value="stages">3. Stages</TabsTrigger>
//               <TabsTrigger value="approvers">4. Approvers</TabsTrigger>
//             </TabsList>

//             {/* TAB 1: WORKFLOW TYPE */}
//             <TabsContent value="type">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Workflow Type Configuration</CardTitle>
//                   <CardDescription>
//                     Define the workflow type and branch scope (Step 1 of 4)
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="type-name">Type Name *</Label>
//                     <Input
//                       id="type-name"
//                       placeholder="e.g., Purchase Below 50K, High Value Approval"
//                       value={workflowType.workflow_types_name || ''}
//                       onChange={(e) =>
//                         setWorkflowType({ ...workflowType, workflow_types_name: e.target.value })
//                       }
//                     />
//                     <p className="text-xs text-gray-500">
//                       This name will identify this workflow configuration
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="branches-type">Branch Type *</Label>
//                     <Select
//                       value={workflowType.types_branches || 'ALL'}
//                       onValueChange={(value) =>
//                         setWorkflowType({ ...workflowType, types_branches: value })
//                       }
//                     >
//                       <SelectTrigger id="branches-type">
//                         <SelectValue placeholder="Select branch type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="ALL">All Branches (Apply to all organizational units)</SelectItem>
//                         <SelectItem value="SPECIFIC">Specific Branches (Select authorized branches)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <p className="text-xs text-gray-500">
//                       {workflowType.types_branches === 'ALL'
//                         ? 'This workflow will apply to all branches'
//                         : 'You will need to specify authorized branches in the next step'}
//                     </p>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" onClick={handleReset}>
//                     Cancel
//                   </Button>
//                   <Button 
//                     onClick={() => {
//                       if (validateWorkflowType()) {
//                         setActiveTab('branches');
//                       }
//                     }}
//                   >
//                     Next: Configure Branches →
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </TabsContent>

//             {/* TAB 2: AUTH BRANCHES */}
//             <TabsContent value="branches">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Authorized Branches</CardTitle>
//                   <CardDescription>
//                     {workflowType.types_branches === 'ALL'
//                       ? 'This workflow applies to all branches. You can skip to the next step.'
//                       : 'Add specific branches authorized for this workflow type (Step 2 of 4)'}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {workflowType.types_branches === 'SPECIFIC' && (
//                     <>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="com-sno">Company *</Label>
//                           <Input
//                             id="com-sno"
//                             type="number"
//                             placeholder="Company No"
//                             value={currentAuthBranch.com_sno || ''}
//                             onChange={(e) =>
//                               setCurrentAuthBranch({
//                                 ...currentAuthBranch,
//                                 com_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="div-sno">Division</Label>
//                           <Input
//                             id="div-sno"
//                             type="number"
//                             placeholder="Division No"
//                             value={currentAuthBranch.div_sno || ''}
//                             onChange={(e) =>
//                               setCurrentAuthBranch({
//                                 ...currentAuthBranch,
//                                 div_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="brn-sno">Branch *</Label>
//                           <Input
//                             id="brn-sno"
//                             type="number"
//                             placeholder="Branch No"
//                             value={currentAuthBranch.brn_sno || ''}
//                             onChange={(e) =>
//                               setCurrentAuthBranch({
//                                 ...currentAuthBranch,
//                                 brn_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="dept-sno">Department</Label>
//                           <Input
//                             id="dept-sno"
//                             type="number"
//                             placeholder="Dept No"
//                             value={currentAuthBranch.dept_sno || ''}
//                             onChange={(e) =>
//                               setCurrentAuthBranch({
//                                 ...currentAuthBranch,
//                                 dept_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <Button onClick={handleAddAuthBranch} className="w-full">
//                         <Plus className="mr-2 h-4 w-4" /> Add Branch
//                       </Button>

//                       <Separator />
//                     </>
//                   )}

//                   <div className="space-y-2">
//                     <Label>
//                       {workflowType.types_branches === 'ALL'
//                         ? 'Applies to all branches'
//                         : `Added Branches (${authBranches.length})`}
//                     </Label>
//                     {workflowType.types_branches === 'SPECIFIC' && authBranches.length === 0 ? (
//                       <p className="text-sm text-gray-500">No branches added yet. Add at least one branch to continue.</p>
//                     ) : workflowType.types_branches === 'SPECIFIC' ? (
//                       <div className="space-y-2">
//                         {authBranches.map((branch) => (
//                           <div
//                             key={branch.workflow_auth_branches_id}
//                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
//                           >
//                             <div className="flex gap-4 text-sm">
//                               <span>
//                                 <strong>Company:</strong> {branch.com_sno}
//                               </span>
//                               <span>
//                                 <strong>Division:</strong> {branch.div_sno || 'All'}
//                               </span>
//                               <span>
//                                 <strong>Branch:</strong> {branch.brn_sno}
//                               </span>
//                               <span>
//                                 <strong>Dept:</strong> {branch.dept_sno || 'All'}
//                               </span>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() =>
//                                 handleRemoveAuthBranch(branch.workflow_auth_branches_id!)
//                               }
//                             >
//                               <Trash2 className="h-4 w-4 text-red-500" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                         <p className="text-sm text-blue-700">
//                           ✓ This workflow configuration will be available to all branches across the organization
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" onClick={() => setActiveTab('type')}>
//                     ← Back
//                   </Button>
//                   <Button onClick={() => setActiveTab('stages')}>
//                     Next: Configure Stages →
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </TabsContent>

//             {/* TAB 3: STAGES */}
//             <TabsContent value="stages">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Approval Stages</CardTitle>
//                   <CardDescription>
//                     Define approval stages and their conditions (Step 3 of 4)
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="stage-name">Stage Name *</Label>
//                       <Input
//                         id="stage-name"
//                         placeholder="e.g., Department Head Approval"
//                         value={currentStage.stage_name || ''}
//                         onChange={(e) =>
//                           setCurrentStage({ ...currentStage, stage_name: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="stage-order">Stage Order *</Label>
//                       <Input
//                         id="stage-order"
//                         type="number"
//                         min="1"
//                         value={currentStage.stage_order || 1}
//                         onChange={(e) =>
//                           setCurrentStage({ ...currentStage, stage_order: Number(e.target.value) })
//                         }
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="stage-type">Stage Type *</Label>
//                       <Select
//                         value={currentStage.stage_type || 'SEQUENTIAL'}
//                         onValueChange={(value) =>
//                           setCurrentStage({ ...currentStage, stage_type: value })
//                         }
//                       >
//                         <SelectTrigger id="stage-type">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="SEQUENTIAL">Sequential (One after another)</SelectItem>
//                           <SelectItem value="PARALLEL">Parallel (All at once)</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="escalation-hours">Escalation Hours</Label>
//                       <Input
//                         id="escalation-hours"
//                         type="number"
//                         min="0"
//                         value={currentStage.escalation_hours || 24}
//                         onChange={(e) =>
//                           setCurrentStage({
//                             ...currentStage,
//                             escalation_hours: Number(e.target.value),
//                           })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="required"
//                         checked={currentStage.required_approvals === 'Y'}
//                         onCheckedChange={(checked) =>
//                           setCurrentStage({
//                             ...currentStage,
//                             required_approvals: checked ? 'Y' : 'N',
//                           })
//                         }
//                       />
//                       <Label htmlFor="required" className="cursor-pointer text-sm">
//                         Required Approvals
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="mandatory"
//                         checked={currentStage.is_mandatory === 'Y'}
//                         onCheckedChange={(checked) =>
//                           setCurrentStage({ ...currentStage, is_mandatory: checked ? 'Y' : 'N' })
//                         }
//                       />
//                       <Label htmlFor="mandatory" className="cursor-pointer text-sm">
//                         Mandatory Stage
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="can-skip"
//                         checked={currentStage.can_skip === 'Y'}
//                         onCheckedChange={(checked) =>
//                           setCurrentStage({ ...currentStage, can_skip: checked ? 'Y' : 'N' })
//                         }
//                       />
//                       <Label htmlFor="can-skip" className="cursor-pointer text-sm">
//                         Can Skip
//                       </Label>
//                     </div>
//                   </div>

//                   <Button onClick={handleAddStage} className="w-full">
//                     <Plus className="mr-2 h-4 w-4" /> Add Stage
//                   </Button>

//                   <Separator />

//                   <div className="space-y-2">
//                     <Label>Added Stages ({stages.length})</Label>
//                     {stages.length === 0 ? (
//                       <p className="text-sm text-gray-500">No stages added yet. Add at least one stage to continue.</p>
//                     ) : (
//                       <div className="space-y-2">
//                         {stages
//                           .sort((a, b) => a.stage_order - b.stage_order)
//                           .map((stage) => (
//                             <div
//                               key={stage.stage_id}
//                               className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
//                             >
//                               <div className="space-y-1 flex-1">
//                                 <div className="flex items-center gap-2">
//                                   <Badge variant="outline" className="font-mono">
//                                     #{stage.stage_order}
//                                   </Badge>
//                                   <span className="font-semibold">{stage.stage_name}</span>
//                                   <Badge variant="secondary" className="text-xs">
//                                     {stage.stage_type}
//                                   </Badge>
//                                 </div>
//                                 <div className="flex gap-4 text-xs text-gray-600">
//                                   <span>⏱ Escalation: {stage.escalation_hours}h</span>
//                                   <span>
//                                     {stage.is_mandatory === 'Y' ? '✓ Mandatory' : '○ Optional'}
//                                   </span>
//                                   <span>
//                                     {stage.can_skip === 'Y' ? '⏭ Skippable' : '⏸ Non-skippable'}
//                                   </span>
//                                   <span>
//                                     {stage.required_approvals === 'Y'
//                                       ? '✓ Approval Required'
//                                       : '○ No Approval'}
//                                   </span>
//                                 </div>
//                               </div>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleRemoveStage(stage.stage_id!)}
//                               >
//                                 <Trash2 className="h-4 w-4 text-red-500" />
//                               </Button>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" onClick={() => setActiveTab('branches')}>
//                     ← Back
//                   </Button>
//                   <Button onClick={() => setActiveTab('approvers')} disabled={stages.length === 0}>
//                     Next: Configure Approvers →
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </TabsContent>

//             {/* TAB 4: APPROVERS */}
//             <TabsContent value="approvers">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Stage Approvers</CardTitle>
//                   <CardDescription>
//                     Assign approvers to each workflow stage (Step 4 of 4)
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="stage-select">Select Stage *</Label>
//                     <Select
//                       value={selectedStageForApprover?.toString() || ''}
//                       onValueChange={(value) => setSelectedStageForApprover(Number(value))}
//                     >
//                       <SelectTrigger id="stage-select">
//                         <SelectValue placeholder="Select stage to add approvers" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {stages
//                           .sort((a, b) => a.stage_order - b.stage_order)
//                           .map((stage) => (
//                             <SelectItem key={stage.stage_id} value={stage.stage_id!.toString()}>
//                               Stage {stage.stage_order}: {stage.stage_name}
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {selectedStageForApprover && (
//                     <>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2 md:col-span-2">
//                           <Label htmlFor="user-select">User *</Label>
//                           <Select
//                             value={currentApprover.nt_sign_up_sno?.toString() || ''}
//                             onValueChange={(value) =>
//                               setCurrentApprover({
//                                 ...currentApprover,
//                                 nt_sign_up_sno: Number(value),
//                               })
//                             }
//                           >
//                             <SelectTrigger id="user-select">
//                               <SelectValue placeholder="Select approver" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {users.map((user) => (
//                                 <SelectItem
//                                   key={user.nt_sign_up_sno}
//                                   value={user.nt_sign_up_sno.toString()}
//                                 >
//                                   {user.name} ({user.ecno}) - {user.department}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="approver-com">Company No</Label>
//                           <Input
//                             id="approver-com"
//                             type="number"
//                             placeholder="Company No (Optional)"
//                             value={currentApprover.com_sno || ''}
//                             onChange={(e) =>
//                               setCurrentApprover({
//                                 ...currentApprover,
//                                 com_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="approver-div">Division No</Label>
//                           <Input
//                             id="approver-div"
//                             type="number"
//                             placeholder="Division No (Optional)"
//                             value={currentApprover.div_sno || ''}
//                             onChange={(e) =>
//                               setCurrentApprover({
//                                 ...currentApprover,
//                                 div_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="approver-brn">Branch No</Label>
//                           <Input
//                             id="approver-brn"
//                             type="number"
//                             placeholder="Branch No (Optional)"
//                             value={currentApprover.brn_sno || ''}
//                             onChange={(e) =>
//                               setCurrentApprover({
//                                 ...currentApprover,
//                                 brn_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="approver-dept">Department No</Label>
//                           <Input
//                             id="approver-dept"
//                             type="number"
//                             placeholder="Dept No (Optional)"
//                             value={currentApprover.dept_sno || ''}
//                             onChange={(e) =>
//                               setCurrentApprover({
//                                 ...currentApprover,
//                                 dept_sno: Number(e.target.value),
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

//                       <Button onClick={handleAddApprover} className="w-full">
//                         <Plus className="mr-2 h-4 w-4" /> Add Approver to Selected Stage
//                       </Button>
//                     </>
//                   )}

//                   <Separator />

//                   <div className="space-y-2">
//                     <Label>Configured Approvers ({approvers.length})</Label>
//                     {approvers.length === 0 ? (
//                       <p className="text-sm text-gray-500">
//                         No approvers added yet. Add at least one approver to complete configuration.
//                       </p>
//                     ) : (
//                       <div className="space-y-4">
//                         {stages
//                           .sort((a, b) => a.stage_order - b.stage_order)
//                           .map((stage) => {
//                             const stageApprovers = approvers.filter(
//                               (a) => a.stage_id === stage.stage_id
//                             );
//                             if (stageApprovers.length === 0) return null;

//                             return (
//                               <div key={stage.stage_id} className="space-y-2">
//                                 <div className="font-semibold text-sm flex items-center gap-2">
//                                   <Badge variant="outline">#{stage.stage_order}</Badge>
//                                   {stage.stage_name}
//                                   <Badge variant="secondary" className="text-xs">
//                                     {stageApprovers.length} approver{stageApprovers.length > 1 ? 's' : ''}
//                                   </Badge>
//                                 </div>
//                                 <div className="space-y-1">
//                                   {stageApprovers.map((approver) => {
//                                     const user = users.find(
//                                       (u) => u.nt_sign_up_sno === approver.nt_sign_up_sno
//                                     );
//                                     return (
//                                       <div
//                                         key={approver.approver_id}
//                                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg ml-4 border"
//                                       >
//                                         <div className="flex flex-col gap-1">
//                                           <div className="flex gap-2 items-center">
//                                             <span className="font-medium">{user?.name}</span>
//                                             <Badge variant="outline" className="text-xs">
//                                               {user?.ecno}
//                                             </Badge>
//                                             <span className="text-xs text-gray-500">
//                                               {user?.department}
//                                             </span>
//                                           </div>
//                                           <div className="text-xs text-gray-600">
//                                             Co: {approver.com_sno || 'All'} | Div:{' '}
//                                             {approver.div_sno || 'All'} | Br:{' '}
//                                             {approver.brn_sno || 'All'} | Dept:{' '}
//                                             {approver.dept_sno || 'All'}
//                                           </div>
//                                         </div>
//                                         <Button
//                                           variant="ghost"
//                                           size="sm"
//                                           onClick={() => handleRemoveApprover(approver.approver_id!)}
//                                         >
//                                           <Trash2 className="h-4 w-4 text-red-500" />
//                                         </Button>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                   <Button variant="outline" onClick={() => setActiveTab('stages')}>
//                     ← Back
//                   </Button>
//                   <Button 
//                     onClick={handleSubmit} 
//                     disabled={approvers.length === 0}
//                     className="bg-green-600 hover:bg-green-700"
//                   >
//                     <Save className="mr-2 h-4 w-4" /> Save Complete Configuration
//                   </Button>
//                 </CardFooter>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </>
//       )}
//     </div>
//   );
// };

// export default WorkflowPostingForm;


// pages/WorkflowMaster.tsx
// pages/WorkflowMaster.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';

// ============ MOCK DATA ============
const MOCK_COMPANIES = [
  { com_sno: '1', com_name: 'Space Textiles Pvt Ltd' },
  { com_sno: '2', com_name: 'STPL Manufacturing' },
  { com_sno: '3', com_name: 'Space Exports Ltd' },
  { com_sno: '4', com_name: 'Textile Solutions Inc' },
];

const MOCK_DIVISIONS = [
  { div_sno: '1', div_name: 'Precious Metals Division', com_sno: '1' },
  { div_sno: '2', div_name: 'Textile Division', com_sno: '1' },
  { div_sno: '3', div_name: 'Supply Chain Division', com_sno: '1' },
  { div_sno: '4', div_name: 'Procurement Division', com_sno: '2' },
  { div_sno: '5', div_name: 'Finance Division', com_sno: '1' },
];

const MOCK_BRANCHES = [
  { brn_sno: '1', brn_name: 'Mumbai HQ', div_sno: '1' },
  { brn_sno: '2', brn_name: 'Delhi Branch', div_sno: '1' },
  { brn_sno: '3', brn_name: 'Chennai Branch', div_sno: '2' },
  { brn_sno: '4', brn_name: 'Bangalore Branch', div_sno: '3' },
  { brn_sno: '5', brn_name: 'Pune Branch', div_sno: '2' },
  { brn_sno: '6', brn_name: 'Hyderabad Branch', div_sno: '4' },
];

const MOCK_DEPARTMENTS = [
  { dept_sno: '1', dept_name: 'Procurement', brn_sno: '1' },
  { dept_sno: '2', dept_name: 'Finance', brn_sno: '1' },
  { dept_sno: '3', dept_name: 'Operations', brn_sno: '1' },
  { dept_sno: '4', dept_name: 'Inventory', brn_sno: '2' },
  { dept_sno: '5', dept_name: 'Quality Assurance', brn_sno: '3' },
  { dept_sno: '6', dept_name: 'Compliance', brn_sno: '1' },
  { dept_sno: '7', dept_name: 'Logistics', brn_sno: '4' },
];

const MOCK_USERS = [
  { user_id: 101, user_name: 'Rajesh Kumar', designation: 'Manager - Procurement', dept_sno: '1' },
  { user_id: 102, user_name: 'Priya Sharma', designation: 'Senior Manager - Finance', dept_sno: '2' },
  { user_id: 103, user_name: 'Amit Patel', designation: 'VP - Operations', dept_sno: '3' },
  { user_id: 104, user_name: 'Sneha Reddy', designation: 'CFO', dept_sno: '2' },
  { user_id: 105, user_name: 'Vikram Singh', designation: 'Director - Compliance', dept_sno: '6' },
  { user_id: 106, user_name: 'Ananya Iyer', designation: 'Team Lead - Inventory', dept_sno: '4' },
  { user_id: 107, user_name: 'Karthik Menon', designation: 'Supervisor - QA', dept_sno: '5' },
  { user_id: 108, user_name: 'Meera Desai', designation: 'Manager - Logistics', dept_sno: '7' },
  { user_id: 109, user_name: 'Suresh Rao', designation: 'AGM - Finance', dept_sno: '2' },
  { user_id: 110, user_name: 'Lakshmi Nair', designation: 'CEO', dept_sno: '3' },
];

// ============ INTERFACES ============
interface WorkflowFormData {
  workflow_name: string;
  workflow_code: string;
  entity_type: string;
  description: string;
  is_active: boolean;
}

interface WorkflowType {
  workflow_types_id?: number;
  workflow_types_name: string;
  types_branches: string;
  is_active: boolean;
}

interface WorkflowStage {
  stage_id?: number;
  stage_order: number;
  stage_name: string;
  stage_type: string;
  required_approvals: number;
  is_mandatory: boolean;
  can_skip: boolean;
  escalation_hours: number;
  is_active: boolean;
}

interface Approver {
  approver_id?: number;
  primary_approver_id: string;
  secondary_approver_id: string;
  stage_id: number;
  com_sno: string;
  div_sno: string;
  brn_sno: string;
  dept_sno: string;
  is_active: boolean;
}

interface Condition {
  condition_id?: number;
  condition_name: string;
  condition_type: string;
  operator_type: string;
  condition_value: string;
  priority_order: number;
  stage_id: number;
  target_stage_id: number;
  is_active: boolean;
}

interface AuthBranch {
  workflow_auth_branches_id?: number;
  workflow_types_id: number;
  com_sno: string;
  div_sno: string;
  brn_sno: string;
  dept_sno: string;
}

const WorkflowMaster: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [workflowId, setWorkflowId] = useState<number | null>(null);

  // Form States
  const [workflow, setWorkflow] = useState<WorkflowFormData>({
    workflow_name: '',
    workflow_code: '',
    entity_type: '',
    description: '',
    is_active: true,
  });

  const [workflowTypes, setWorkflowTypes] = useState<WorkflowType[]>([
    {
      workflow_types_name: '',
      types_branches: '',
      is_active: true,
    },
  ]);

  const [authBranches, setAuthBranches] = useState<AuthBranch[]>([]);

  const [stages, setStages] = useState<WorkflowStage[]>([
    {
      stage_order: 1,
      stage_name: '',
      stage_type: 'approval',
      required_approvals: 1,
      is_mandatory: true,
      can_skip: false,
      escalation_hours: 24,
      is_active: true,
    },
  ]);

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  // Mock Data States
  const [companies] = useState(MOCK_COMPANIES);
  const [divisions] = useState(MOCK_DIVISIONS);
  const [branches] = useState(MOCK_BRANCHES);
  const [departments] = useState(MOCK_DEPARTMENTS);
  const [users] = useState(MOCK_USERS);

  // ============ LOAD SAMPLE DATA ============
  const loadSampleData = () => {
    // Workflow Basic Info
    setWorkflow({
      workflow_name: 'KYC Vendor Approval Workflow',
      workflow_code: 'WF_KYC_2026_001',
      entity_type: 'KYC',
      description: 'Multi-stage approval workflow for vendor KYC verification with dynamic routing based on vendor type and transaction amount',
      is_active: true,
    });

    // Workflow Types
    setWorkflowTypes([
      {
        workflow_types_name: 'Standard KYC - Local Vendors',
        types_branches: 'Mumbai, Delhi, Chennai',
        is_active: true,
      },
      {
        workflow_types_name: 'Fast Track KYC - Registered Vendors',
        types_branches: 'All Branches',
        is_active: true,
      },
      {
        workflow_types_name: 'Enhanced Due Diligence - International',
        types_branches: 'Mumbai HQ',
        is_active: true,
      },
    ]);

    // Auth Branches
    setAuthBranches([
      { workflow_types_id: 0, com_sno: '1', div_sno: '1', brn_sno: '1', dept_sno: '1' },
      { workflow_types_id: 0, com_sno: '1', div_sno: '2', brn_sno: '3', dept_sno: '5' },
      { workflow_types_id: 1, com_sno: '1', div_sno: '3', brn_sno: '4', dept_sno: '7' },
      { workflow_types_id: 2, com_sno: '1', div_sno: '5', brn_sno: '1', dept_sno: '6' },
    ]);

    // Stages
    setStages([
      {
        stage_order: 1,
        stage_name: 'Initial Verification',
        stage_type: 'verification',
        required_approvals: 1,
        is_mandatory: true,
        can_skip: false,
        escalation_hours: 24,
        is_active: true,
      },
      {
        stage_order: 2,
        stage_name: 'Manager Approval',
        stage_type: 'approval',
        required_approvals: 1,
        is_mandatory: true,
        can_skip: false,
        escalation_hours: 48,
        is_active: true,
      },
      {
        stage_order: 3,
        stage_name: 'Finance Review',
        stage_type: 'review',
        required_approvals: 1,
        is_mandatory: true,
        can_skip: false,
        escalation_hours: 72,
        is_active: true,
      },
      {
        stage_order: 4,
        stage_name: 'Compliance Check',
        stage_type: 'verification',
        required_approvals: 1,
        is_mandatory: true,
        can_skip: false,
        escalation_hours: 48,
        is_active: true,
      },
      {
        stage_order: 5,
        stage_name: 'Final Approval - CFO',
        stage_type: 'approval',
        required_approvals: 1,
        is_mandatory: false,
        can_skip: true,
        escalation_hours: 96,
        is_active: true,
      },
    ]);

    // Approvers
    setApprovers([
      {
        primary_approver_id: '106',
        secondary_approver_id: '107',
        stage_id: 0,
        com_sno: '1',
        div_sno: '1',
        brn_sno: '1',
        dept_sno: '4',
        is_active: true,
      },
      {
        primary_approver_id: '101',
        secondary_approver_id: '108',
        stage_id: 1,
        com_sno: '1',
        div_sno: '1',
        brn_sno: '1',
        dept_sno: '1',
        is_active: true,
      },
      {
        primary_approver_id: '102',
        secondary_approver_id: '109',
        stage_id: 2,
        com_sno: '1',
        div_sno: '5',
        brn_sno: '1',
        dept_sno: '2',
        is_active: true,
      },
      {
        primary_approver_id: '105',
        secondary_approver_id: '0',
        stage_id: 3,
        com_sno: '1',
        div_sno: '1',
        brn_sno: '1',
        dept_sno: '6',
        is_active: true,
      },
      {
        primary_approver_id: '104',
        secondary_approver_id: '110',
        stage_id: 4,
        com_sno: '1',
        div_sno: '5',
        brn_sno: '1',
        dept_sno: '2',
        is_active: true,
      },
    ]);

    // Conditions
    setConditions([
      {
        condition_name: 'High Value Transaction - Skip to CFO',
        condition_type: 'amount',
        operator_type: '>',
        condition_value: '1000000',
        priority_order: 1,
        stage_id: 2,
        target_stage_id: 4,
        is_active: true,
      },
      {
        condition_name: 'International Vendor - Compliance Required',
        condition_type: 'custom',
        operator_type: '==',
        condition_value: 'INTERNATIONAL',
        priority_order: 2,
        stage_id: 1,
        target_stage_id: 3,
        is_active: true,
      },
      {
        condition_name: 'Low Value Local Vendor - Fast Track',
        condition_type: 'amount',
        operator_type: '<',
        condition_value: '50000',
        priority_order: 3,
        stage_id: 0,
        target_stage_id: 1,
        is_active: true,
      },
    ]);

    toast.success('Sample data loaded successfully!');
  };

  // ============ WORKFLOW HANDLERS ============
  const handleWorkflowChange = (field: keyof WorkflowFormData, value: any) => {
    setWorkflow((prev) => ({ ...prev, [field]: value }));
  };

  // ============ WORKFLOW TYPES HANDLERS ============
  const addWorkflowType = () => {
    setWorkflowTypes((prev) => [
      ...prev,
      {
        workflow_types_name: '',
        types_branches: '',
        is_active: true,
      },
    ]);
  };

  const updateWorkflowType = (index: number, field: keyof WorkflowType, value: any) => {
    setWorkflowTypes((prev) =>
      prev.map((type, i) => (i === index ? { ...type, [field]: value } : type))
    );
  };

  const removeWorkflowType = (index: number) => {
    setWorkflowTypes((prev) => prev.filter((_, i) => i !== index));
    setAuthBranches((prev) => prev.filter((branch) => branch.workflow_types_id !== index));
  };

  // ============ AUTH BRANCHES HANDLERS ============
  const addAuthBranch = (workflowTypeIndex: number) => {
    setAuthBranches((prev) => [
      ...prev,
      {
        workflow_types_id: workflowTypeIndex,
        com_sno: '',
        div_sno: '',
        brn_sno: '',
        dept_sno: '',
      },
    ]);
  };

  const updateAuthBranch = (index: number, field: keyof AuthBranch, value: any) => {
    setAuthBranches((prev) =>
      prev.map((branch, i) => (i === index ? { ...branch, [field]: value } : branch))
    );
  };

  const removeAuthBranch = (index: number) => {
    setAuthBranches((prev) => prev.filter((_, i) => i !== index));
  };

  // ============ STAGE HANDLERS ============
  const addStage = () => {
    setStages((prev) => [
      ...prev,
      {
        stage_order: prev.length + 1,
        stage_name: '',
        stage_type: 'approval',
        required_approvals: 1,
        is_mandatory: true,
        can_skip: false,
        escalation_hours: 24,
        is_active: true,
      },
    ]);
  };

  const updateStage = (index: number, field: keyof WorkflowStage, value: any) => {
    setStages((prev) =>
      prev.map((stage, i) => (i === index ? { ...stage, [field]: value } : stage))
    );
  };

  const removeStage = (index: number) => {
    setStages((prev) =>
      prev.filter((_, i) => i !== index).map((stage, idx) => ({ ...stage, stage_order: idx + 1 }))
    );
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stages.length - 1)
    )
      return;

    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];

    setStages(newStages.map((stage, idx) => ({ ...stage, stage_order: idx + 1 })));
  };

  // ============ APPROVER HANDLERS ============
  const addApprover = () => {
    setApprovers((prev) => [
      ...prev,
      {
        primary_approver_id: '',
        secondary_approver_id: '0',
        stage_id: 0,
        com_sno: '',
        div_sno: '',
        brn_sno: '',
        dept_sno: '',
        is_active: true,
      },
    ]);
  };

  const updateApprover = (index: number, field: keyof Approver, value: any) => {
    setApprovers((prev) =>
      prev.map((approver, i) => (i === index ? { ...approver, [field]: value } : approver))
    );
  };

  const removeApprover = (index: number) => {
    setApprovers((prev) => prev.filter((_, i) => i !== index));
  };

  // ============ CONDITION HANDLERS ============
  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        condition_name: '',
        condition_type: 'amount',
        operator_type: '>',
        condition_value: '',
        priority_order: prev.length + 1,
        stage_id: 0,
        target_stage_id: 0,
        is_active: true,
      },
    ]);
  };

  const updateCondition = (index: number, field: keyof Condition, value: any) => {
    setConditions((prev) =>
      prev.map((condition, i) => (i === index ? { ...condition, [field]: value } : condition))
    );
  };

  const removeCondition = (index: number) => {
    setConditions((prev) =>
      prev.filter((_, i) => i !== index).map((cond, idx) => ({ ...cond, priority_order: idx + 1 }))
    );
  };

  // ============ VALIDATION ============
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!workflow.workflow_name || !workflow.workflow_code || !workflow.entity_type) {
          toast.error('Please fill all required workflow fields');
          return false;
        }
        return true;

      case 2:
        if (workflowTypes.some((type) => !type.workflow_types_name)) {
          toast.error('Please fill all workflow type names');
          return false;
        }
        return true;

      case 3:
        if (stages.length === 0) {
          toast.error('At least one stage is required');
          return false;
        }
        if (stages.some((stage) => !stage.stage_name)) {
          toast.error('Please fill all stage names');
          return false;
        }
        return true;

      case 4:
        if (approvers.length === 0) {
          toast.warning('No approvers added. Consider adding at least one.');
        }
        return true;

      case 5:
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // ============ SUBMIT HANDLER ============
  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);

    const payload = {
      workflow,
      workflowTypes,
      authBranches,
      stages,
      approvers,
      conditions,
    };

    // Simulate API call
    setTimeout(() => {
      console.log('=== WORKFLOW PAYLOAD ===');
      console.log(JSON.stringify(payload, null, 2));
      
      setWorkflowId(Math.floor(Math.random() * 1000) + 1);
      setLoading(false);
      
      toast.success('Workflow saved successfully!', {
        description: 'Check console for payload details',
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workflow Master Configuration</h1>
          <p className="text-muted-foreground">
            Create and configure dynamic approval workflows for your organization
          </p>
        </div>
        <Button onClick={loadSampleData} variant="outline" size="lg">
          Load Sample Data
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            'Basic Info',
            'Workflow Types',
            'Stages',
            'Approvers',
            'Conditions',
          ].map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className="text-xs mt-2 text-center max-w-[100px]">{label}</span>
              </div>
              {index < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Workflow Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Workflow Information</CardTitle>
            <CardDescription>Define the core details of your workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="workflow_name">
                  Workflow Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="workflow_name"
                  placeholder="e.g., KYC Approval Workflow"
                  value={workflow.workflow_name}
                  onChange={(e) => handleWorkflowChange('workflow_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow_code">
                  Workflow Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="workflow_code"
                  placeholder="e.g., WF_KYC_001"
                  value={workflow.workflow_code}
                  onChange={(e) => handleWorkflowChange('workflow_code', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity_type">
                Entity Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={workflow.entity_type}
                onValueChange={(value) => handleWorkflowChange('entity_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KYC">KYC - Know Your Customer</SelectItem>
                  <SelectItem value="PR">PR - Purchase Requisition</SelectItem>
                  <SelectItem value="PO">PO - Purchase Order</SelectItem>
                  <SelectItem value="INV">INV - Invoice</SelectItem>
                  <SelectItem value="EXP">EXP - Expense Claim</SelectItem>
                  <SelectItem value="LEAVE">LEAVE - Leave Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this workflow..."
                rows={4}
                value={workflow.description}
                onChange={(e) => handleWorkflowChange('description', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={workflow.is_active}
                onCheckedChange={(checked) => handleWorkflowChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active Workflow</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Workflow Types */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Workflow Types</CardTitle>
                <CardDescription>
                  Define different types/variants for this workflow
                </CardDescription>
              </div>
              <Button onClick={addWorkflowType} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Type
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {workflowTypes.map((type, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="mt-2">
                      Type {index + 1}
                    </Badge>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>
                            Type Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g., Standard KYC, Fast Track KYC"
                            value={type.workflow_types_name}
                            onChange={(e) =>
                              updateWorkflowType(index, 'workflow_types_name', e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Type Branches</Label>
                          <Input
                            placeholder="e.g., ALL, MUMBAI, DELHI"
                            value={type.types_branches}
                            onChange={(e) =>
                              updateWorkflowType(index, 'types_branches', e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={type.is_active}
                          onCheckedChange={(checked) =>
                            updateWorkflowType(index, 'is_active', checked)
                          }
                        />
                        <Label>Active</Label>
                      </div>

                      {/* Auth Branches Section */}
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-semibold">
                            Authorized Branches for this Type
                          </Label>
                          <Button
                            onClick={() => addAuthBranch(index)}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Branch
                          </Button>
                        </div>

                        {authBranches
                          .map((branch, branchIdx) => ({ branch, branchIdx }))
                          .filter(({ branch }) => branch.workflow_types_id === index)
                          .map(({ branch, branchIdx }) => (
                            <Card key={branchIdx} className="mb-2 bg-muted/50">
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-4 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Company</Label>
                                    <Select
                                      value={branch.com_sno}
                                      onValueChange={(value) =>
                                        updateAuthBranch(branchIdx, 'com_sno', value)
                                      }
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {companies.map((com) => (
                                          <SelectItem key={com.com_sno} value={com.com_sno}>
                                            {com.com_name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">Division</Label>
                                    <Select
                                      value={branch.div_sno}
                                      onValueChange={(value) =>
                                        updateAuthBranch(branchIdx, 'div_sno', value)
                                      }
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {divisions.map((div) => (
                                          <SelectItem key={div.div_sno} value={div.div_sno}>
                                            {div.div_name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">Branch</Label>
                                    <Select
                                      value={branch.brn_sno}
                                      onValueChange={(value) =>
                                        updateAuthBranch(branchIdx, 'brn_sno', value)
                                      }
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {branches.map((brn) => (
                                          <SelectItem key={brn.brn_sno} value={brn.brn_sno}>
                                            {brn.brn_name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs">Department</Label>
                                    <Select
                                      value={branch.dept_sno}
                                      onValueChange={(value) =>
                                        updateAuthBranch(branchIdx, 'dept_sno', value)
                                      }
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {departments.map((dept) => (
                                          <SelectItem key={dept.dept_sno} value={dept.dept_sno}>
                                            {dept.dept_name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <Button
                                  onClick={() => removeAuthBranch(branchIdx)}
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Remove
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => removeWorkflowType(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Stages */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Approval Stages</CardTitle>
                <CardDescription>
                  Define the sequential stages for approval workflow
                </CardDescription>
              </div>
              <Button onClick={addStage} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Stage
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stages.map((stage, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Order Controls */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => moveStage(index, 'up')}
                        disabled={index === 0}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Badge variant="secondary" className="justify-center">
                        {stage.stage_order}
                      </Badge>
                      <Button
                        onClick={() => moveStage(index, 'down')}
                        disabled={index === stages.length - 1}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stage Details */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>
                            Stage Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g., Manager Approval, Finance Review"
                            value={stage.stage_name}
                            onChange={(e) => updateStage(index, 'stage_name', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Stage Type</Label>
                          <Select
                            value={stage.stage_type}
                            onValueChange={(value) => updateStage(index, 'stage_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approval">Approval</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="verification">Verification</SelectItem>
                              <SelectItem value="acknowledgment">Acknowledgment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Required Approvals</Label>
                          <Input
                            type="number"
                            min="1"
                            value={stage.required_approvals}
                            onChange={(e) =>
                              updateStage(index, 'required_approvals', parseInt(e.target.value) || 1)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Escalation Hours</Label>
                          <Input
                            type="number"
                            min="1"
                            value={stage.escalation_hours}
                            onChange={(e) =>
                              updateStage(index, 'escalation_hours', parseInt(e.target.value) || 24)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-transparent">Switches</Label>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={stage.is_mandatory}
                                onCheckedChange={(checked) =>
                                  updateStage(index, 'is_mandatory', checked)
                                }
                              />
                              <Label className="text-sm">Mandatory</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={stage.can_skip}
                                onCheckedChange={(checked) =>
                                  updateStage(index, 'can_skip', checked)
                                }
                              />
                              <Label className="text-sm">Can Skip</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={stage.is_active}
                                onCheckedChange={(checked) =>
                                  updateStage(index, 'is_active', checked)
                                }
                              />
                              <Label className="text-sm">Active</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      onClick={() => removeStage(index)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Approvers */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Stage Approvers</CardTitle>
                <CardDescription>
                  Assign primary and secondary approvers for each stage
                </CardDescription>
              </div>
              <Button onClick={addApprover} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Approver
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No approvers added yet. Click "Add Approver" to get started.</p>
              </div>
            ) : (
              approvers.map((approver, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Badge variant="outline">#{index + 1}</Badge>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Stage</Label>
                            <Select
                              value={approver.stage_id.toString()}
                              onValueChange={(value) =>
                                updateApprover(index, 'stage_id', parseInt(value))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select stage" />
                              </SelectTrigger>
                              <SelectContent>
                                {stages.map((stage, idx) => (
                                  <SelectItem key={idx} value={idx.toString()}>
                                    {stage.stage_name || `Stage ${idx + 1}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Primary Approver</Label>
                            <Select
                              value={approver.primary_approver_id}
                              onValueChange={(value) =>
                                updateApprover(index, 'primary_approver_id', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                    {user.user_name} - {user.designation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Secondary Approver</Label>
                            <Select
                              value={approver.secondary_approver_id}
                              onValueChange={(value) =>
                                updateApprover(index, 'secondary_approver_id', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">None</SelectItem>
                                {users.map((user) => (
                                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                    {user.user_name} - {user.designation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Select
                              value={approver.com_sno}
                              onValueChange={(value) => updateApprover(index, 'com_sno', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((com) => (
                                  <SelectItem key={com.com_sno} value={com.com_sno}>
                                    {com.com_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Division</Label>
                            <Select
                              value={approver.div_sno}
                              onValueChange={(value) => updateApprover(index, 'div_sno', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {divisions.map((div) => (
                                  <SelectItem key={div.div_sno} value={div.div_sno}>
                                    {div.div_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Branch</Label>
                            <Select
                              value={approver.brn_sno}
                              onValueChange={(value) => updateApprover(index, 'brn_sno', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {branches.map((brn) => (
                                  <SelectItem key={brn.brn_sno} value={brn.brn_sno}>
                                    {brn.brn_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Department</Label>
                            <Select
                              value={approver.dept_sno}
                              onValueChange={(value) => updateApprover(index, 'dept_sno', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.dept_sno} value={dept.dept_sno}>
                                    {dept.dept_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={approver.is_active}
                            onCheckedChange={(checked) =>
                              updateApprover(index, 'is_active', checked)
                            }
                          />
                          <Label>Active</Label>
                        </div>
                      </div>

                      <Button
                        onClick={() => removeApprover(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Conditions */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Routing Conditions</CardTitle>
                <CardDescription>
                  Define dynamic routing rules based on conditions (Optional)
                </CardDescription>
              </div>
              <Button onClick={addCondition} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {conditions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conditions added. Workflow will follow sequential stage order.</p>
                <p className="text-sm mt-2">Add conditions for dynamic routing based on business rules.</p>
              </div>
            ) : (
              conditions.map((condition, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Badge variant="outline" className="mt-2">
                        P{condition.priority_order}
                      </Badge>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Condition Name</Label>
                            <Input
                              placeholder="e.g., High Value Check"
                              value={condition.condition_name}
                              onChange={(e) =>
                                updateCondition(index, 'condition_name', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Condition Type</Label>
                            <Select
                              value={condition.condition_type}
                              onValueChange={(value) =>
                                updateCondition(index, 'condition_type', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="amount">Amount</SelectItem>
                                <SelectItem value="department">Department</SelectItem>
                                <SelectItem value="role">Role</SelectItem>
                                <SelectItem value="branch">Branch</SelectItem>
                                <SelectItem value="custom">Custom Field</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Operator</Label>
                            <Select
                              value={condition.operator_type}
                              onValueChange={(value) =>
                                updateCondition(index, 'operator_type', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value=">">&gt; Greater than</SelectItem>
                                <SelectItem value=">=">&gt;= Greater or equal</SelectItem>
                                <SelectItem value="<">&lt; Less than</SelectItem>
                                <SelectItem value="<=">&lt;= Less or equal</SelectItem>
                                <SelectItem value="==">== Equal to</SelectItem>
                                <SelectItem value="!=">!= Not equal</SelectItem>
                                <SelectItem value="IN">IN (Contains)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Value</Label>
                            <Input
                              placeholder="e.g., 100000"
                              value={condition.condition_value}
                              onChange={(e) =>
                                updateCondition(index, 'condition_value', e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>From Stage</Label>
                            <Select
                              value={condition.stage_id.toString()}
                              onValueChange={(value) =>
                                updateCondition(index, 'stage_id', parseInt(value))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {stages.map((stage, idx) => (
                                  <SelectItem key={idx} value={idx.toString()}>
                                    {stage.stage_name || `Stage ${idx + 1}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Route to Stage</Label>
                            <Select
                              value={condition.target_stage_id.toString()}
                              onValueChange={(value) =>
                                updateCondition(index, 'target_stage_id', parseInt(value))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {stages.map((stage, idx) => (
                                  <SelectItem key={idx} value={idx.toString()}>
                                    {stage.stage_name || `Stage ${idx + 1}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={condition.is_active}
                            onCheckedChange={(checked) =>
                              updateCondition(index, 'is_active', checked)
                            }
                          />
                          <Label>Active</Label>
                        </div>
                      </div>

                      <Button
                        onClick={() => removeCondition(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          size="lg"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < 5 ? (
            <Button onClick={handleNext} size="lg">
              Next Step
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} size="lg">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Workflow'}
            </Button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {workflowId && (
        <Card className="mt-6 border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Workflow Created Successfully!</p>
                <p className="text-sm text-green-700">
                  Workflow ID: {workflowId} - Check browser console for full payload
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowMaster;

