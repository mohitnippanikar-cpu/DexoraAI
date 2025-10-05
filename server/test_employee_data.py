#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main_model import process_user_query

def test_employee_data_query():
    """Test the employee data query that should require HR authorization"""
    
    # Test cases: HR user vs non-HR user
    test_cases = [
        (1, "View employee data", "Human Resources"),  # HR user - should be authorized
        (3, "View employee data", "Sales"),  # Non-HR user - should be unauthorized
    ]
    
    for user_id, query, expected_dept in test_cases:
        print(f"\n{'='*60}")
        print(f"Testing: User ID {user_id} ({expected_dept}) asking: '{query}'")
        print('='*60)
        
        result = process_user_query(user_id, query)
        
        print("Result:")
        for key, value in result.items():
            print(f"  {key}: {value}")
        
        # Check the results
        if result.get("requested_dept") == "ALL_DEPARTMENTS":
            print("\n✅ SUCCESS: Query detected as requiring departmental authorization!")
            
            if result.get("is_authorized") == True and expected_dept == "Human Resources":
                print("✅ SUCCESS: HR user properly authorized!")
            elif result.get("is_authorized") == False and expected_dept != "Human Resources":
                print("✅ SUCCESS: Non-HR user properly denied!")
            else:
                print(f"❌ AUTHORIZATION ISSUE: Expected different result for {expected_dept}")
        else:
            print(f"❌ DETECTION ISSUE: Query not detected as departmental request (got: {result.get('requested_dept')})")

if __name__ == "__main__":
    test_employee_data_query()
