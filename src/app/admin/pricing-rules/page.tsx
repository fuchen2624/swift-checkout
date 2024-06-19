'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { PricingRule } from '@/models/pricingRules';

const PricingRulesPage = () => {
    const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
    const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

    useEffect(() => {
        fetchPricingRules();
    }, []);

    const fetchPricingRules = async () => {
        const response = await fetch('/api/pricing-rules');
        const data = await response.json();

        if (response.ok) {
            setPricingRules(data.rules);
        } else {
            console.error('Error fetching pricing rules:', data.error);
        }
    };

    const handleSaveRule = async () => {
        if (editingRule) {
            const method = editingRule.id ? 'PUT' : 'POST';
            const url = editingRule.id ? '/api/pricing-rules' : '/api/pricing-rules';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingRule),
            });

            if (response.ok) {
                fetchPricingRules();
                setEditingRule(null);
            } else {
                console.error('Error saving pricing rule:', await response.json());
            }
        }
    };

    const handleDeleteRule = async (ruleId: number) => {
        const response = await fetch(`/api/pricing-rules?id=${ruleId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchPricingRules();
        } else {
            console.error('Error deleting pricing rule:', await response.json());
        }
    };

    return (
        <Box p={4}>
            <Box mb={4}>
                <Button onClick={() => setEditingRule({ type: 'quantity_discount' } as PricingRule)}>Add New Rule</Button>
            </Box>
            <Table>
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>SKU</Th>
                        <Th>Type</Th>
                        <Th>Parameters</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {pricingRules.map((rule) => (
                        <Tr key={rule.id}>
                            <Td>{rule.id}</Td>
                            <Td>{rule.sku}</Td>
                            <Td>{rule.type}</Td>
                            <Td>{JSON.stringify(rule.parameters)}</Td>
                            <Td>
                                <Button size="sm" mr={2} onClick={() => setEditingRule(rule)}>
                                    Edit
                                </Button>
                                <Button size="sm" colorScheme="red" onClick={() => handleDeleteRule(rule.id)}>
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {editingRule && (
                <Box mt={4}>
                    <FormControl mb={2}>
                        <FormLabel>SKU</FormLabel>
                        <Input
                            value={editingRule.sku}
                            onChange={(e) => setEditingRule({ ...editingRule, sku: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mb={2}>
                        <FormLabel>Type</FormLabel>
                        <Select
                            value={editingRule.type}
                            onChange={(e) => setEditingRule({ ...editingRule, type: e.target.value })}
                        >
                            <option value="quantity_discount">Quantity Discount</option>
                            <option value="bundle">Bundle</option>
                        </Select>
                    </FormControl>
                    <FormControl mb={2}>
                        <FormLabel>Parameters</FormLabel>
                        <Input
                            value={JSON.stringify(editingRule.parameters)}
                            onChange={(e) =>
                                setEditingRule({ ...editingRule, parameters: JSON.parse(e.target.value) })
                            }
                        />
                    </FormControl>
                    <Button onClick={handleSaveRule}>Save</Button>
                </Box>
            )}
        </Box>
    );
};

export default PricingRulesPage;